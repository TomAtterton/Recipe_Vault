export type BoundingBox = {
  width: number;
  height: number;
  x: number;
  y: number;
  text?: string;
};

export type Block = {
  boundingBox: BoundingBox;
  text: string;
  lines: string[];
};

export type ScaledBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

export type SelectedBox = {
  title: string;
  color: string;
  boundingBoxes: BoundingBox[];
};

export type FieldSelection =
  | 'title'
  | 'prepTime'
  | 'cookTime'
  | 'servings'
  | 'instructions'
  | 'ingredients';

export type BoundingBoxColors = Partial<Record<FieldSelection, string>>;
