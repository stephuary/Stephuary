#!/usr/bin/env python3
"""
Generate Stephuary favicons (PNG) — gold "S" mark on navy, rounded square.
Writes favicon.png (32x32) and apple-touch-icon.png (180x180) next to index.html.

Palette: navy #0B1730, gold #C9A24A.
Re-run anytime the mark changes.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAVY = (0x0B, 0x17, 0x30, 255)
GOLD = (0xC9, 0xA2, 0x4A, 255)


def rounded_square(size: int, radius_ratio: float = 0.18) -> Image.Image:
    """Return a navy image with a rounded-corner alpha mask applied."""
    scale = 4  # supersample
    w = size * scale
    radius = int(w * radius_ratio)
    mask = Image.new("L", (w, w), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, w - 1, w - 1), radius=radius, fill=255
    )
    mask = mask.resize((size, size), Image.LANCZOS)
    base = Image.new("RGBA", (size, size), NAVY)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask)
    return out


def find_serif_font(px: int) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/Library/Fonts/Georgia.ttf",
        "/System/Library/Fonts/NewYork.ttf",
        "/System/Library/Fonts/Times.ttc",
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, px)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_mark(size: int) -> Image.Image:
    img = rounded_square(size)
    draw = ImageDraw.Draw(img)
    # Canela-style serif "S" — use Georgia Bold as a close alternative.
    font = find_serif_font(int(size * 0.76))
    text = "S"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    # Center accounting for negative bearing
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] - int(size * 0.02)
    draw.text((x, y), text, fill=GOLD, font=font)
    return img


def main() -> None:
    for name, size in (("favicon.png", 32), ("apple-touch-icon.png", 180)):
        out = ROOT / name
        img = draw_mark(size)
        img.save(out, "PNG", optimize=True)
        print(f"wrote {out.relative_to(ROOT)} ({size}x{size})")


if __name__ == "__main__":
    main()
