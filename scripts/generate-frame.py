"""Generate the Navy & Ember frame images (variant B): a dark ultramarine field crossed by
thin red-hot filaments, in the spirit of the Sentinel-2 Holbox image but entirely synthetic.

    python3 scripts/generate-frame.py            # writes src/assets/frame/b/{header,footer}.png

Deterministic (fixed seeds). The left `CLEAR` fraction of each image is kept free of
filaments so nothing hot sits behind the site name (design issue C5).
Requires numpy, scipy and Pillow.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

OUT = Path(__file__).resolve().parent.parent / "src/assets/frame/b"
SS = 2  # supersampling for anti-aliased filaments

# Palette sampled from the ESA image (navy field) and the design tokens (ember).
NAVY_DARK = np.array([2, 4, 38], dtype=np.float32)      # left / deep water
NAVY_LIGHT = np.array([12, 26, 150], dtype=np.float32)  # right / lit water
SWELL = np.array([30, 60, 200], dtype=np.float32)        # faint swell highlights
EMBER = (231, 56, 58)                                    # filament core
GLOW = (175, 55, 69)                                     # ember-glow, filament halo


def field(w: int, h: int, rng: np.random.Generator) -> np.ndarray:
    """Navy background: left-to-right gradient, cloudy low-frequency variation,
    horizontally stretched swell texture and fine grain."""
    x = np.linspace(0, 1, w, dtype=np.float32)[None, :, None]
    t = np.clip(x**1.3, 0, 1)
    img = NAVY_DARK * (1 - t) + NAVY_LIGHT * t
    img = np.broadcast_to(img, (h, w, 3)).copy()

    clouds = gaussian_filter(rng.standard_normal((h, w)).astype(np.float32), sigma=(h / 6, w / 14))
    clouds /= np.abs(clouds).max() + 1e-6
    img *= (1 + 0.28 * clouds)[..., None]

    swell = gaussian_filter(rng.standard_normal((h, w)).astype(np.float32), sigma=(3.5, 26))
    swell = np.clip(swell / (swell.std() * 2.5), 0, 1) ** 1.5 * np.clip(x[..., 0] * 1.4, 0, 1)
    img += swell[..., None] * SWELL * 0.22

    mottle = gaussian_filter(rng.standard_normal((h, w)).astype(np.float32), sigma=(6, 10))
    img *= (1 + 0.10 * mottle / (np.abs(mottle).max() + 1e-6))[..., None]

    grain = rng.standard_normal((h, w, 1)).astype(np.float32) * 2.2
    return np.clip(img + grain, 0, 255)


def filament(rng: np.random.Generator, w: int, h: int, x0: float, y0: float, length: float):
    """A smooth, mostly horizontal, slightly rising random path, as a list of points."""
    pts, ang = [], rng.uniform(-0.35, 0.05)
    x, y = x0, y0
    for _ in range(int(length / 6)):
        ang += rng.normal(0, 0.09) - 0.03 * (ang + 0.12)  # wander, pulled towards a gentle rise
        x += 6 * np.cos(ang)
        y += 6 * np.sin(ang)
        if not (0 <= x < w and 0 <= y < h):
            break
        pts.append((x, y))
    return pts


def draw_filaments(w: int, h: int, rng: np.random.Generator, count: int, clear: float):
    """RGBA layer with broken filaments (dashes of varying width) and a soft glow."""
    W, H = w * SS, h * SS
    core = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(core)
    for _ in range(count):
        x0 = rng.uniform(clear, 0.92) * w
        y0 = rng.uniform(0.2, 0.95) * h
        pts = filament(rng, w, h, x0, y0, rng.uniform(0.12, 0.45) * w)
        i = 0
        while i < len(pts) - 1:
            seg = rng.integers(1, 7)  # dash length (points)
            gap = rng.integers(1, 5) if rng.random() < 0.7 else 0
            chunk = pts[i : i + seg + 1]
            if len(chunk) > 1:
                width = max(1, int(rng.choice([1, 1, 1, 2, 2, 3]) * SS))
                d.line([(px * SS, py * SS) for px, py in chunk], fill=255, width=width, joint="curve")
            i += seg + gap
        if rng.random() < 0.35 and pts:  # occasional small bloom, like the image's patches
            bx, by = pts[rng.integers(len(pts))]
            r = rng.uniform(3, 7) * SS
            d.ellipse([bx * SS - r, by * SS - r * 0.7, bx * SS + r, by * SS + r * 0.7], fill=220)
    core = core.resize((w, h), Image.LANCZOS)
    glow = core.filter(ImageFilter.GaussianBlur(3))
    return np.asarray(core, dtype=np.float32) / 255, np.asarray(glow, dtype=np.float32) / 255


def render(name: str, w: int, h: int, seed: int, count: int, clear: float):
    rng = np.random.default_rng(seed)
    img = field(w, h, rng)
    core, glow = draw_filaments(w, h, rng, count, clear)
    img = img * (1 - 0.55 * glow[..., None]) + np.array(GLOW, np.float32) * 0.55 * glow[..., None]
    img = img * (1 - core[..., None]) + np.array(EMBER, np.float32) * core[..., None]
    OUT.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT / f"{name}.png", optimize=True)
    print(f"wrote {OUT / name}.png ({w}x{h})")


if __name__ == "__main__":
    # Same aspect ratios as the ESA crops; 2400px wide covers 2x on most screens.
    render("header", 2400, 274, seed=7, count=7, clear=0.42)
    render("footer", 2400, 406, seed=11, count=18, clear=0.30)
