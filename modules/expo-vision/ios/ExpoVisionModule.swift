import ExpoModulesCore
import Foundation
import MLKitTextRecognition
import MLKitVision

public class ExpoVisionModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoVision")

    AsyncFunction("fetchTextFromImage") { (filePath: String, promise: Promise) in

        guard FileManager.default.fileExists(atPath: URL(fileURLWithPath: filePath).path) else {
            promise.reject(NSError(domain: "ExpoVision", code: 1, userInfo: [NSLocalizedDescriptionKey: "File does not exist at path."]))
            return
        }
      // Load the image from the file path
      guard let image = UIImage(contentsOfFile: filePath) else {
        promise.reject(NSError(domain: "ExpoVision", code: 2, userInfo: [NSLocalizedDescriptionKey: "Failed to load image from file path."]))
        return
      }

        // Convert UIImage to MLImage
        guard let mlImage = MLImage(image: image) else {
          promise.reject("ERR_IMAGE_NOT_FOUND", "Issue converting image")
          return
        }

        let options = TextRecognizerOptions() /// same thing as `TextRecognizerOptions.init()`

      // Initialize the text recognizer with default options (multi-language support)
        let textRecognizer = TextRecognizer.textRecognizer(options: options)

      // Process the image
      textRecognizer.process(mlImage) { result, error in
        if let error = error {
          promise.reject(error)
          return
        }

        guard let result = result else {
          promise.reject(NSError(domain: "ExpoVision", code: 3, userInfo: [NSLocalizedDescriptionKey: "Text recognition failed."]))
          return
        }

        // Extract recognized text
        let recognizedText = result.text
        promise.resolve(recognizedText)
      }
    }
  }
}
