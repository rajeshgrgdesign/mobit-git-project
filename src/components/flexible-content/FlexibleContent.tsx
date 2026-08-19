import type { FlexibleContentLayout } from "@/lib/wp/types";
import { blockRegistry } from "./registry";

interface FlexibleContentProps {
  layouts?: FlexibleContentLayout[];
}

/**
 * Renders an ACF Flexible Content field by walking its layout rows in
 * order and dispatching each one to the matching block component via
 * `blockRegistry`. Unknown layouts are skipped (logged in dev) rather
 * than crashing the page, so editors adding a new ACF layout can't take
 * down already-published pages before the frontend block ships.
 */
export default function FlexibleContent({ layouts }: FlexibleContentProps) {
  if (!layouts || layouts.length === 0) return null;

  return (
    <>
      {layouts.map((layout, index) => {
        const Block = blockRegistry[layout.acf_fc_layout];

        if (!Block) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[FlexibleContent] No block registered for layout "${layout.acf_fc_layout}"`,
            );
          }
          return null;
        }

        // Index is stable for a given page render (layouts are server-rendered
        // in the order the CMS returns them), acceptable as a key here.
        return <Block key={`${layout.acf_fc_layout}-${index}`} {...layout} />;
      })}
    </>
  );
}
