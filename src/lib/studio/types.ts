import type { BrandColorToken } from "./brandColors";
import type { StudioFont } from "./fonts";

type BaseElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
};

export type TextElement = BaseElement & {
  type: "text";
  content: string;
  color: BrandColorToken;
  fontFamily: StudioFont;
  fontSize: number;
  fontWeight: number;
  textAlign: "left" | "center" | "right" | "justify";
  italic: boolean;
  lineHeight: number;
  letterSpacing: number;
  height: number;
};

export type CardElement = BaseElement & {
  type: "card";
  height: number;
  color: BrandColorToken;
  radius: number;
};

export type StudioElement = TextElement | CardElement;
