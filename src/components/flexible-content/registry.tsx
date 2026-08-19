import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import HeroBlock from "./blocks/HeroBlock";
import RichTextBlock from "./blocks/RichTextBlock";
import ImageBlock from "./blocks/ImageBlock";
import CtaBlock from "./blocks/CtaBlock";

// Below-the-fold / interaction-heavy blocks are code-split out of the main
// bundle. They only ship JS to the client if a page actually uses them,
// which keeps the shared bundle small for pages that don't.
const GalleryBlock = dynamic(() => import("./blocks/GalleryBlock"));

/**
 * Maps an ACF Flexible Content layout name (`acf_fc_layout`) to the React
 * component that renders it. Add a new block by dropping it in `./blocks`
 * and registering it here — no changes needed anywhere else.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const blockRegistry: Record<string, ComponentType<any>> = {
  hero: HeroBlock,
  rich_text: RichTextBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  cta: CtaBlock,
};

export type BlockLayoutName = keyof typeof blockRegistry;
