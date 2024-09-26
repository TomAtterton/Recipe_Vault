import ExpoModulesCore
import Foundation
import UIKit
import TOCropViewController



struct ExpoError: Error, LocalizedError {
    let errorCode: Int
    let message: String
    var errorDescription: String? {
        return message
    }
    func toNSError() -> NSError {
        return NSError(domain: "ExpoImageCropperModule", code: errorCode, userInfo: [NSLocalizedDescriptionKey: message])
    }
}


struct CropOptions: Record {
    @Field
    var isTemporary: Bool?
}


public class ExpoImageCropperModule: Module {

    private var croppingDelegate: CroppingViewControllerDelegate = CroppingViewControllerDelegate()
    private var rootViewController: UIViewController? {
        return UIApplication.shared.windows.first(where: { $0.isKeyWindow })?.rootViewController
    }

public func definition() -> ModuleDefinition {
    Name("ExpoImageCropper")

    AsyncFunction("cropImage") { (filePath: String, cropOptions: CropOptions, promise: Promise) in

        self.croppingDelegate.currentPromise = promise
        self.croppingDelegate.options = cropOptions

        DispatchQueue.global().async {

            var image: UIImage?

            if filePath.starts(with: "data:image") {
                // Handle base64 encoded image string
                let base64String = filePath.components(separatedBy: ",").last ?? ""
                if let imageData = Data(base64Encoded: base64String) {
                    image = UIImage(data: imageData)
                } else {
                    promise.reject(ExpoError(errorCode: 6, message: "Failed to decode base64 image string."))
                    return
                }
            } else {
                // Try to create a URL from the file path
                guard let filePathURL = URL(string: filePath) else {
                    promise.reject(ExpoError(errorCode: 1, message: "Error converting filePath to URL."))
                    return
                }

                if filePathURL.scheme == "http" || filePathURL.scheme == "https" {
                    // Load image from URL
                    do {
                        let imageData = try Data(contentsOf: filePathURL)
                        image = UIImage(data: imageData)
                    } catch {
                        promise.reject(ExpoError(errorCode: 5, message: "Failed to load image from URL."))
                        return
                    }
                } else {
                    // Load image from local file path
                    let localFilePath = filePathURL.path

                    guard FileManager.default.fileExists(atPath: localFilePath) else {
                        promise.reject(ExpoError(errorCode: 2, message: "File does not exist at path."))
                        return
                    }

                    image = UIImage(contentsOfFile: localFilePath)
                }
            }

            guard let validImage = image else {
                promise.reject(ExpoError(errorCode: 3, message: "Failed to load image."))
                return
            }

            DispatchQueue.main.async {

                guard let rootVC = self.rootViewController else {
                    promise.reject(ExpoError(errorCode: 4, message: "Unable to get root view controller."))
                    return
                }

                let cropViewController = TOCropViewController(image: validImage)
                cropViewController.modalPresentationStyle = .overFullScreen
                cropViewController.modalTransitionStyle = .coverVertical
                cropViewController.delegate = self.croppingDelegate

                rootVC.present(cropViewController, animated: true, completion: nil)
            }
        }
    }

}

}


class CroppingViewControllerDelegate: NSObject, TOCropViewControllerDelegate {

    var currentPromise: Promise?
    var options: CropOptions?

    func cropViewController(_ cropViewController: TOCropViewController, didFinishCancelled cancelled: Bool) {
        self.currentPromise?.reject(ExpoError(errorCode: 6, message: "Cancelled."))
        cropViewController.dismiss(animated: true, completion: nil)
    }

    private func saveImageToDocuments(image: UIImage) throws -> URL {
        let imageData: Data?

        if options?.isTemporary ?? false {
            // Use PNG for temporary storage to retain highest quality
            imageData = image.pngData()
        } else {
            // Use JPEG for non-temporary storage
            imageData = image.jpegData(compressionQuality: 1.0)
        }

        guard let data = imageData else {
            throw ExpoError(errorCode: 5, message: "Failed to convert cropped image to data.")
        }

        let directoryURL = options?.isTemporary ?? false ? FileManager.default.temporaryDirectory : FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let filename = UUID().uuidString
        let fileExtension = options?.isTemporary ?? false ? "png" : "jpeg"
        let fileURL = directoryURL.appendingPathComponent("\(filename).\(fileExtension)")

        do {
            try data.write(to: fileURL)
        } catch {
            throw ExpoError(errorCode: 6, message: "Failed to save cropped image.")
        }

        return fileURL
    }


    public func cropViewController(_ cropViewController: TOCropViewController, didCropTo image: UIImage, with rect: CGRect, angle: Int) {

        do {
            let fileURL = try saveImageToDocuments(image: image)
            let width = image.size.width
            let height = image.size.height
            let fileType = fileURL.pathExtension.lowercased()

            // Attempt to convert the image to a base64 string
            let base64Image: String
            if options?.isTemporary ?? false {
                // Handle PNG base64 encoding
                if let pngData = image.pngData() {
                    base64Image = "data:image/png;base64," + pngData.base64EncodedString()
                } else {
                    base64Image = ""  // Provide a default value if conversion fails
                }
            } else {
                // Handle JPEG base64 encoding
                if let jpegData = image.jpegData(compressionQuality: 1.0) {
                    base64Image = "data:image/jpeg;base64," + jpegData.base64EncodedString()
                } else {
                    base64Image = ""  // Provide a default value if conversion fails
                }
            }

            let result: [String: Any] = [
                "filePath": fileURL.path,
                "base64Image": base64Image,
                "fileType": fileType,
                "width": width,
                "height": height,
                "angle": angle,
                "rect": [
                    "x": rect.origin.x,
                    "y": rect.origin.y,
                    "width": rect.size.width,
                    "height": rect.size.height
                ]
            ]

            self.currentPromise?.resolve(result)
        } catch {
            self.currentPromise?.reject(ExpoError(errorCode: 6, message: "Failed to save cropped image."))
        }

        cropViewController.presentingViewController?.dismiss(animated: true, completion: nil)
    }

}
