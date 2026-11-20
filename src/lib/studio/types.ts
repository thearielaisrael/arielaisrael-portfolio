import type { BrandColorToken } from "./brandColors";
import type { StudioFont } from "./fonts";
import type { CanvasPreset } from "./canvasPresets";

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
  fillType?: "solid" | "gradient";
  gradient?: StudioGradient;
  effects?: StudioBackgroundEffect[];
};

export type StudioElement = TextElement | CardElement;

export type StudioAmbientGlowSource = {
  id: string;
  color: string;
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

export type StudioAmbientGlowPreset = {
  id: string;
  name: string;
  category: "website" | "ethereal";
  description: string;
  sources: StudioAmbientGlowSource[];
};

export type StudioParticleSettings = {
  count: number;
  size: number;
  connectionOpacity: number;
  connectionDistance: number;
};

export type StudioGridSettings = {
  style: "lines" | "dots";
  spacing: number;
  lineWidth: number;
};

export type StudioPatternSettings = {
  style: "waves" | "diagonal-lines" | "crosses" | "diamonds";
  spacing: number;
  lineWidth: number;
  rotation: number;
};

export type StudioBackgroundEffectType =
  "gradient" | "ambient-glow" | "particles" | "connections" | "grid" | "pattern";

export type StudioBackgroundEffect = {
  id: string;
  type: StudioBackgroundEffectType;
  enabled: boolean;
  seed: number;
  opacity: number;
  color: string;
  secondaryColor?: string;
  intensity: number;
  scale: number;
  gradient?: StudioGradient;
  glowSources?: StudioAmbientGlowSource[];
  originalGlowSources?: StudioAmbientGlowSource[];
  ambientGlowPresetId?: string;
  particles?: StudioParticleSettings;
  grid?: StudioGridSettings;
  pattern?: StudioPatternSettings;
};

export type StudioGradientStop = {
  id: string;
  color: string;
  position: number;
};

export type StudioGradient = {
  type: "linear" | "radial";
  angle: number;
  stops: StudioGradientStop[];
  opacity: number;
};

export type StudioSlide = {
  id: string;
  name: string;
  backgroundColor: BrandColorToken;
  backgroundEffects: StudioBackgroundEffect[];
  elements: StudioElement[];
};

export type StudioProject = {
  id: string;
  name: string;
  canvasPreset: CanvasPreset;
  slides: StudioSlide[];
  activeSlideId: string;
};
