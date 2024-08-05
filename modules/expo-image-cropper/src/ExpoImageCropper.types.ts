// Enum for aspect ratio presets (corresponding to TOCropViewControllerAspectRatioPreset)
export enum AspectRatioPreset {
  Square = 'square',
  Portrait = 'portrait',
  Landscape = 'landscape',
  Custom = 'custom',
}

// Enum for toolbar position (corresponding to TOCropViewControllerToolbarPosition)
export enum ToolbarPosition {
  Bottom = 'bottom',
  Top = 'top',
}

export interface CropOptions {
  isTemporary?: boolean;

  // File type for saving the image
  fileType?: string;

  // Aspect ratio preset
  aspectRatioPreset?: AspectRatioPreset;

  // Custom aspect ratio (e.g., { width: 4, height: 3 })
  customAspectRatio?: { width: number; height: number };

  // Name for the custom aspect ratio
  customAspectRatioName?: string;

  // Whether the aspect ratio is locked and can swap dimensions
  aspectRatioLockDimensionSwapEnabled?: boolean;

  // Whether the aspect ratio is locked
  aspectRatioLockEnabled?: boolean;

  // Whether the reset button also resets the aspect ratio
  resetAspectRatioEnabled?: boolean;

  // Position of the toolbar
  toolbarPosition?: ToolbarPosition;

  // Hide specific buttons on the toolbar
  rotateClockwiseButtonHidden?: boolean;
  rotateButtonsHidden?: boolean;
  resetButtonHidden?: boolean;
  aspectRatioPickerButtonHidden?: boolean;
  doneButtonHidden?: boolean;
  cancelButtonHidden?: boolean;

  // Colors for buttons (hex color or rgb/a format)
  doneButtonColor?: string;
  cancelButtonColor?: string;

  // Title for the Done and Cancel buttons
  doneButtonTitle?: string;
  cancelButtonTitle?: string;

  // If true, shows the rotation button in portrait
  showOnlyIcons?: boolean;

  // Whether to show a confirmation dialog on cancel
  showCancelConfirmationDialog?: boolean;

  // If the toolbar should be in RTL layout
  reverseContentLayout?: boolean;

  // Activity items for the activity sheet
  activityItems?: any[]; // Replace 'any' with specific types if known
  applicationActivities?: any[]; // Replace 'any' with specific types if known
  excludedActivityTypes?: string[]; // e.g., ["com.apple.UIKit.activity.SaveToCameraRoll"]

  // Allowed aspect ratios
  allowedAspectRatios?: AspectRatioPreset[];
}
