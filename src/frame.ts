import headerA from './assets/frame/a/header.png';
import footerA from './assets/frame/a/footer.png';
import headerB from './assets/frame/b/header.png';
import footerB from './assets/frame/b/footer.png';

/**
 * Frame image variant (A/B test, REFACTOR_PLAN Phase 3):
 *   a: crops of ESA's Sentinel-2 "Holbox Island, Mexico" (CC BY-SA 3.0 IGO, credit in footer)
 *   b: generated look-alike (scripts/generate-frame.py)
 * Choose with PUBLIC_FRAME=a|b at build time; defaults to a.
 */
export const FRAME_VARIANT = import.meta.env.PUBLIC_FRAME === 'b' ? 'b' : 'a';
export const FRAME = FRAME_VARIANT === 'b' ? { header: headerB, footer: footerB } : { header: headerA, footer: footerA };
