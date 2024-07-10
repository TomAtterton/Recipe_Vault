interface CornerPathParams {
  a: number;
  b: number;
  c: number;
  d: number;
  p: number;
  cornerRadius: number;
  arcSectionLength: number;
}

interface CornerParams {
  cornerRadius: number;
  cornerSmoothing: number;
  // roundingAndSmoothingBudget: number;
}

// The original code by MartinRGB
// https://github.com/MartinRGB/Figma_Squircles_Approximation/blob/bf29714aab58c54329f3ca130ffa16d39a2ff08c/js/rounded-corners.js#L64
export function getPathParamsForCorner({
  cornerRadius,
  cornerSmoothing,
}: // roundingAndSmoothingBudget,
CornerParams): CornerPathParams {
  let p = (1 + cornerSmoothing) * cornerRadius;

  // const maxCornerSmoothing = roundingAndSmoothingBudget / cornerRadius - 1;
  // cornerSmoothing = cornerSmoothing;
  // }

  // In a normal rounded rectangle (cornerSmoothing = 0), this is 90
  // The larger the smoothing, the smaller the arc
  const arcMeasure = 90 * (1 - cornerSmoothing);
  const arcSectionLength = Math.sin(toRadians(arcMeasure / 2)) * cornerRadius * Math.sqrt(2);

  // In the article this is the distance between 2 control points: P3 and P4
  const angleAlpha = (90 - arcMeasure) / 2;
  const p3ToP4Distance = cornerRadius * Math.tan(toRadians(angleAlpha / 2));

  // a, b, c and d are from figure 11.1 in the article
  const angleBeta = 45 * cornerSmoothing;
  const c = p3ToP4Distance * Math.cos(toRadians(angleBeta));
  const d = c * Math.tan(toRadians(angleBeta));

  let b = (p - arcSectionLength - c - d) / 3;
  let a = 2 * b;

  return {
    a,
    b,
    c,
    d,
    p,
    arcSectionLength,
    cornerRadius,
  };
}

interface SVGPathInput {
  width: number;
  height: number;
  pathParams: CornerPathParams;
}

export function getSVGPathFromPathParams({ width, height, pathParams }: SVGPathInput) {
  return `
    M ${width - pathParams.p} 0
    ${drawTopRightPath(pathParams)}
    L ${width} ${height - pathParams.p}
    ${drawBottomRightPath(pathParams)}
    L ${pathParams.p} ${height}
    ${drawBottomLeftPath(pathParams)}
    L 0 ${pathParams.p}
    ${drawTopLeftPath(pathParams)}
    Z
  `
    .replace(/[\t\s\n]+/g, ' ')
    .trim();
}

function drawTopRightPath({ cornerRadius, a, b, c, d, p, arcSectionLength }: CornerPathParams) {
  if (cornerRadius) {
    return rounded`
    c ${a} 0 ${a + b} 0 ${a + b + c} ${d}
    a ${cornerRadius} ${cornerRadius} 0 0 1 ${arcSectionLength} ${arcSectionLength}
    c ${d} ${c}
        ${d} ${b + c}
        ${d} ${a + b + c}`;
  } else {
    return rounded`l ${p} 0`;
  }
}

function drawBottomRightPath({ cornerRadius, a, b, c, d, p, arcSectionLength }: CornerPathParams) {
  if (cornerRadius) {
    return rounded`
    c 0 ${a}
      0 ${a + b}
      ${-d} ${a + b + c}
    a ${cornerRadius} ${cornerRadius} 0 0 1 -${arcSectionLength} ${arcSectionLength}
    c ${-c} ${d}
      ${-(b + c)} ${d}
      ${-(a + b + c)} ${d}`;
  } else {
    return rounded`l 0 ${p}`;
  }
}

function drawBottomLeftPath({ cornerRadius, a, b, c, d, p, arcSectionLength }: CornerPathParams) {
  if (cornerRadius) {
    return rounded`
    c ${-a} 0
      ${-(a + b)} 0
      ${-(a + b + c)} ${-d}
    a ${cornerRadius} ${cornerRadius} 0 0 1 -${arcSectionLength} -${arcSectionLength}
    c ${-d} ${-c}
      ${-d} ${-(b + c)}
      ${-d} ${-(a + b + c)}`;
  } else {
    return rounded`l ${-p} 0`;
  }
}

function drawTopLeftPath({ cornerRadius, a, b, c, d, p, arcSectionLength }: CornerPathParams) {
  if (cornerRadius) {
    return rounded`
    c 0 ${-a}
      0 ${-(a + b)}
      ${d} ${-(a + b + c)}
    a ${cornerRadius} ${cornerRadius} 0 0 1 ${arcSectionLength} -${arcSectionLength}
    c ${c} ${-d}
      ${b + c} ${-d}
      ${a + b + c} ${-d}`;
  } else {
    return rounded`l 0 ${-p}`;
  }
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function rounded(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((acc, str, i) => {
    let value = values[i];

    if (typeof value === 'number') {
      return acc + str + value.toFixed(4);
    } else {
      return acc + str + (value ?? '');
    }
  }, '');
}
