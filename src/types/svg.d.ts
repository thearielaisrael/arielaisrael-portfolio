declare module "*.svg" {
  import type { ComponentType, SVGProps } from "react";

  const SVGComponent: ComponentType<SVGProps<SVGSVGElement>>;

  export default SVGComponent;
}
