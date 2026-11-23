import { brandColor } from "../../lib/studio/brandColors";
import type { ShapeElement } from "../../lib/studio/types";

type StudioShapeProps = {
  element: ShapeElement;
};

export default function StudioShape({ element }: StudioShapeProps) {
  const fill = element.fillEnabled ? brandColor(element.fill) : "none";

  const stroke = element.strokeEnabled ? brandColor(element.stroke) : "none";

  const common = {
    fill,
    stroke,
    strokeWidth: element.strokeWidth,
    vectorEffect: "non-scaling-stroke" as const,
  };

  const width = Math.max(1, element.width);
  const height = Math.max(1, element.height);

  function renderShape() {
    switch (element.shape) {
      case "rectangle":
        return <rect x={0} y={0} width={width} height={height} {...common} />;

      case "rounded-rectangle":
        return (
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={element.cornerRadius}
            ry={element.cornerRadius}
            {...common}
          />
        );

      case "ellipse":
        return (
          <ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} {...common} />
        );

      case "triangle":
        return <polygon points={`${width / 2},0 ${width},${height} 0,${height}`} {...common} />;

      case "diamond":
        return (
          <polygon
            points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
            {...common}
          />
        );

      case "line":
        return (
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={brandColor(element.stroke)}
            strokeWidth={element.strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        );
    }
  }

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="pointer-events-none block overflow-visible"
    >
      {renderShape()}
    </svg>
  );
}
