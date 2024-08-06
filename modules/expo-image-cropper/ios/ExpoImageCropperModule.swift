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
//    var aspectRatioPreset: TOCropViewControllerAspectRatioPreset?
//    var customAspectRatio: CGSize?
//    var customAspectRatioName: String?
//    var aspectRatioLockDimensionSwapEnabled: Bool?
//    var aspectRatioLockEnabled: Bool?
//    var resetAspectRatioEnabled: Bool?
//    var toolbarPosition: TOCropViewControllerToolbarPosition?
//    var rotateClockwiseButtonHidden: Bool?
//    var rotateButtonsHidden: Bool?
//    var resetButtonHidden: Bool?
//    var aspectRatioPickerButtonHidden: Bool?
//    var doneButtonHidden: Bool?
//    var cancelButtonHidden: Bool?
//    var doneButtonTitle: String?
//    var cancelButtonTitle: String?
//    var showOnlyIcons: Bool?
//    var showCancelConfirmationDialog: Bool?
//    var reverseContentLayout: Bool?
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

            guard let filePathURL = URL(string: filePath) else {
                promise.reject(ExpoError(errorCode: 1, message: "Error converting filePath to URL."))
                return
            }

            var image: UIImage?

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
        guard let imageData = image.jpegData(compressionQuality: 1.0) else {
            throw ExpoError(errorCode: 5, message: "Failed to convert cropped image to data.")
        }

        guard let options = options else {
            throw ExpoError(errorCode: 59, message: "Options not provided.")
        }

        let directoryURL = options.isTemporary ?? false ? FileManager.default.temporaryDirectory : FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!

        let filename = UUID().uuidString
        let fileURL = directoryURL.appendingPathComponent("\(filename).jpeg")


        do {
            try imageData.write(to: fileURL)
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


            let result: [String: Any] = [
                "filePath": fileURL.path,
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
