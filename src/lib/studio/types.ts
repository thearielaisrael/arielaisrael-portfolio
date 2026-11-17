import type { BrandColorToken } from "./brandColors";

type BaseElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
};

export type TextElement = BaseElement & {
  type: "text";
  content: string;
  color: BrandColorToken;
  fontSize: number;
  fontWeight: number;
};

export type CardElement = BaseElement & {
  type: "card";
  height: number;
  color: BrandColorToken;
  radius: number;
};

export type StudioElement = TextElement | CardElement;
