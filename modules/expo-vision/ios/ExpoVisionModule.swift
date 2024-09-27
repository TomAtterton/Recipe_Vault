import ExpoModulesCore
import Foundation
import UIKit
import CoreImage
import Metal
import Vision

public class ExpoVisionModule: Module {

    enum ExpoVisionError: Error {
        case fileNotFound
        case imageLoadFailed
        case textRecognitionFailed
    }

    // MARK: - Preprocessing Methods

    private func convertToGrayscale(image: UIImage) -> UIImage? {
        guard let ciImage = CIImage(image: image) else { return nil }
        let grayscale = ciImage.applyingFilter("CIPhotoEffectNoir")

        let context = CIContext()
        guard let cgImage = context.createCGImage(grayscale, from: grayscale.extent) else { return nil }
        return UIImage(cgImage: cgImage)
    }

    private func binarise(image: UIImage) -> UIImage? {
        // Create a Metal device and CIContext for rendering
        guard let metalDevice = MTLCreateSystemDefaultDevice() else { return nil }
        let ciContext = CIContext(mtlDevice: metalDevice)

        // Convert UIImage to CIImage
        guard let ciImage = CIImage(image: image) else { return nil }

        // Apply a monochrome filter (similar to binarization)
        let filter = CIFilter(name: "CIPhotoEffectMono")
        filter?.setValue(ciImage, forKey: kCIInputImageKey)

        // Get the output image from the filter
        guard let outputImage = filter?.outputImage else { return nil }

        // Convert the CIImage to a CGImage using the CIContext and Metal
        guard let cgImage = ciContext.createCGImage(outputImage, from: outputImage.extent) else { return nil }

        // Return the new UIImage created from the CGImage
        return UIImage(cgImage: cgImage)
    }

    // Function to scale the image
    private func scaleImage(image: UIImage, by factor: CGFloat) -> UIImage? {
        let newSize = CGSize(width: image.size.width * factor, height: image.size.height * factor)
        UIGraphicsBeginImageContextWithOptions(newSize, false, image.scale)
        image.draw(in: CGRect(origin: .zero, size: newSize))
        let scaledImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return scaledImage
    }

    // MARK: - Text Recognition Method

    private func recognizeTextWithAppleVision(image: UIImage, scaleFactor: CGFloat, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let cgImage = image.cgImage else {
            completion(.failure(ExpoVisionError.imageLoadFailed))
            return
        }

        let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        let request = VNRecognizeTextRequest { (request, error) in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let observations = request.results as? [VNRecognizedTextObservation] else {
                completion(.failure(ExpoVisionError.textRecognitionFailed))
                return
            }

            // Get the size of the image
            let imageSize = CGSize(width: image.size.width, height: image.size.height)

            var recognizedText = ""
            var adjustedBlocks: [[String: Any]] = []

            for observation in observations {
                guard let candidate = observation.topCandidates(1).first else {
                    continue
                }

                recognizedText += candidate.string + "\n"

                let boundingBox = observation.boundingBox

                // Convert bounding box from normalized coordinates to image coordinates
                let rect = VNImageRectForNormalizedRect(boundingBox, Int(imageSize.width), Int(imageSize.height))

                // Adjust the y-coordinate due to coordinate system differences
                let adjustedFrame = CGRect(
                    x: rect.origin.x / scaleFactor,
                    y: (imageSize.height - rect.origin.y - rect.size.height) / scaleFactor,
                    width: rect.size.width / scaleFactor,
                    height: rect.size.height / scaleFactor
                )

                adjustedBlocks.append([
                    "text": candidate.string,
                    "boundingBox": [
                        "x": adjustedFrame.origin.x,
                        "y": adjustedFrame.origin.y,
                        "width": adjustedFrame.size.width,
                        "height": adjustedFrame.size.height
                    ]
                ])
            }

            let response: [String: Any] = [
                "text": recognizedText.trimmingCharacters(in: .whitespacesAndNewlines),
                "blocks": adjustedBlocks
            ]

            completion(.success(response))
        }

        // Set the recognition level (fast or accurate)
        request.recognitionLevel = .accurate

        do {
            try requestHandler.perform([request])
        } catch {
            completion(.failure(error))
        }
    }

    // MARK: - Module Definition

    public func definition() -> ModuleDefinition {
        Name("ExpoVision")

        AsyncFunction("fetchTextFromImage") { (filePath: String, promise: Promise) in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    guard FileManager.default.fileExists(atPath: filePath) else {
                        throw ExpoVisionError.fileNotFound
                    }

                    guard let image = UIImage(contentsOfFile: filePath) else {
                        throw ExpoVisionError.imageLoadFailed
                    }

                    var processedImage = image

                    // Apply preprocessing steps
                    if let grayscaleImage = self.convertToGrayscale(image: processedImage) {
                        processedImage = grayscaleImage
                    }

                    if let binarizedImage = self.binarise(image: processedImage) {
                        processedImage = binarizedImage
                    }

                    let scaleFactor: CGFloat = 1.5

                    // Scale the image
                    if let scaledImage = self.scaleImage(image: processedImage, by: scaleFactor) {
                        processedImage = scaledImage
                    }

                    let recognitionCompletion: (Result<[String: Any], Error>) -> Void = { result in
                        DispatchQueue.main.async {
                            switch result {
                            case .success(let response):
                                promise.resolve(response)
                            case .failure(let error):
                                promise.reject(error.localizedDescription, "An error occurred during text recognition.")
                            }
                        }
                    }

                    self.recognizeTextWithAppleVision(image: processedImage, scaleFactor: scaleFactor, completion: recognitionCompletion)

                } catch {
                    DispatchQueue.main.async {
                        promise.reject(error.localizedDescription, "An error occurred during text recognition.")
                    }
                }
            }
        }
    }
}
