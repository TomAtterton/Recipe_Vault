import ExpoModulesCore
import Foundation
import MLKitTextRecognition
import MLKitVision





public class ExpoVisionModule: Module {
    
    
    struct Result {
        let text: String
        let boundingBox: CGRect
    }

 private func encodeResult(result: [TextBlock]) -> [[String:Any]?] {
        result.compactMap { currentBlock in
            return [
                "text": currentBlock.text,
                "boundingBox": [
                    "x": currentBlock.frame.origin.x,
                    "y": currentBlock.frame.origin.y,
                    "width": currentBlock.frame.size.width,
                    "height": currentBlock.frame.size.height
                ],
                "lines": currentBlock.lines.compactMap { line in
                    return line.text
                }
            ]
        }
    }

    enum ExpoVisionError: String {
      case fileNotFound = "ERR_FILE_NOT_FOUND"
      case imageLoadFailed = "ERR_IMAGE_LOAD_FAILED"
      // Add more as needed
    }
    
    
    
    
  public func definition() -> ModuleDefinition {
    Name("ExpoVision")

      AsyncFunction("fetchTextFromImage") { (filePath: String, promise: Promise) in

        guard FileManager.default.fileExists(atPath: filePath) else {
          promise.reject("ERR_FILE_NOT_FOUND", "File does not exist at path.")
          return
        }

        guard let image = UIImage(contentsOfFile: filePath) else {
          promise.reject("ERR_IMAGE_LOAD_FAILED", "Failed to load image from file path.")
          return
        }

        let mlImage = VisionImage(image: image)
        mlImage.orientation = image.imageOrientation
          
        let options = TextRecognizerOptions()
        let textRecognizer = TextRecognizer.textRecognizer(options: options)

        textRecognizer.process(mlImage) { result, error in
          if let error = error {
            promise.reject("ERR_TEXT_RECOGNITION_FAILED", error.localizedDescription)
            return
          }

          guard let result = result else {
            promise.reject("ERR_TEXT_RECOGNITION_FAILED", "Text recognition failed.")
            return
          }

          let recognizedText = result.text
          let encodedBlocks = self.encodeResult(result: result.blocks)
            
          let response: [String: Any] = [
            "text": recognizedText,
            "blocks": encodedBlocks
          ]
            
          promise.resolve(response)
        }
      }
  }
}
