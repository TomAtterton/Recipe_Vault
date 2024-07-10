import { getPathParamsForCorner, getSVGPathFromPathParams } from './draw';

export interface FigmaSquircleParams {
  cornerRadius?: number;
  cornerSmoothing: number;
  width: number;
  height: number;
  preserveSmoothing?: boolean;
}

export function getSvgPath({
  cornerRadius = 0,
  cornerSmoothing,
  width,
  height,
}: FigmaSquircleParams) {
  const pathParams = getPathParamsForCorner({
    cornerRadius,
    cornerSmoothing,
  });

  return getSVGPathFromPathParams({
    width,
    height,
    pathParams,
  });
}
