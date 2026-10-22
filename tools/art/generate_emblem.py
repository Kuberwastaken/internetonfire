#!/usr/bin/env python3
"""
internetonfire emblem generator
Prepared for: Kuber Mehta

Original programmatic line-art illustration for the internetonfire site:
a doodle dog sitting at a table with a steaming mug, surrounded by flames.
Drawn entirely with code (no downloaded or third-party artwork).

Requires: Pillow (pip install Pillow)
Usage:    python3 generate_emblem.py [output_dir]
Outputs:  emblem-paper-1024.png, emblem-paper-512.png, emblem-alpha-1024.png,
          flame-favicon-64.png, flame-favicon-32.png, thisisfine-animated-480.gif

Deterministic: fixed random seed reproduces the same artwork every run.
"""

import math
import random
import sys
import os
from PIL import Image, ImageDraw

PAPER = (246, 242, 232, 255)   # #F6F2E8 - original drawing paper
INK = (26, 24, 22, 255)        # #1A1816

SEED = 11

# ---------------------------------------------------------------- primitives

def jittered(points, mag, rng):
    return [(x + rng.uniform(-mag, mag), y + rng.uniform(-mag, mag)) for x, y in points]

def stroke(draw, pts, width, rng, jitter=1.8, closed=False):
    """Ink a polyline with rounded joins and a hand-drawn wobble."""
    pts = jittered(pts, jitter, rng)
    seg = pts + [pts[0]] if closed else pts
    for i in range(len(seg) - 1):
        w = max(int(round(width)), 2)
        x0, y0 = seg[i]; x1, y1 = seg[i + 1]
        draw.line([x0, y0, x1, y1], fill=INK, width=w)
        r = w / 2
        draw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=INK)
    r = max(int(round(width)), 2) / 2
    x0, y0 = seg[0]
    draw.ellipse([x0 - r, y0 - r, x0 + r, y0 + r], fill=INK)

def fill_stroke(draw, pts, width, rng, jitter=1.4):
    """Fill a closed shape with paper, then ink its outline. Filling first
    keeps layered shapes (head over body, ear behind head) clean."""
    draw.polygon([(x, y) for x, y in pts], fill=PAPER)
    stroke(draw, pts, width, rng, jitter=jitter, closed=True)

def fill_only(draw, pts):
    draw.polygon([(x, y) for x, y in pts], fill=PAPER)

def bez(p0, p1, p2, p3=None, n=48):
    """Sample a quadratic or cubic Bezier."""
    pts = []
    for i in range(n + 1):
        t = i / n
        if p3 is None:
            x = (1-t)**2*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0]
            y = (1-t)**2*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1]
        else:
            x = (1-t)**3*p0[0] + 3*(1-t)**2*t*p1[0] + 3*(1-t)*t*t*p2[0] + t**3*p3[0]
            y = (1-t)**3*p0[1] + 3*(1-t)**2*t*p1[1] + 3*(1-t)*t*t*p2[1] + t**3*p3[1]
        pts.append((x, y))
    return pts

def ellipse_arc(cx, cy, rx, ry, a0=0, a1=360, n=72, rot=0):
    pts = []
    rr = math.radians(rot)
    for i in range(n + 1):
        a = math.radians(a0 + (a1 - a0) * i / n)
        x, y = rx * math.cos(a), ry * math.sin(a)
        pts.append((cx + x*math.cos(rr) - y*math.sin(rr),
                    cy + x*math.sin(rr) + y*math.cos(rr)))
    return pts

# ---------------------------------------------------------------- flame

def flame_strokes(cx, base_y, h, w, lean=0.0):
    """Wavy cartoon flame outline + inner lick. Returns a list of strokes."""
    tipx = cx + lean * h
    tipy = base_y - h
    left = bez((cx - w*0.5, base_y - h*0.06),
               (cx - w*0.62, base_y - h*0.28),
               (cx - w*0.28, base_y - h*0.42), n=20)
    left += bez((cx - w*0.28, base_y - h*0.42),
                (cx - w*0.46, base_y - h*0.62),
                (tipx - w*0.10, base_y - h*0.72), n=20)
    left += bez((tipx - w*0.10, base_y - h*0.72),
                (tipx - w*0.02, base_y - h*0.86),
                (tipx, tipy), n=12)
    right = bez((tipx, tipy),
                (tipx + w*0.10, base_y - h*0.80),
                (cx + w*0.34, base_y - h*0.62), n=16)
    right += bez((cx + w*0.34, base_y - h*0.62),
                 (cx + w*0.52, base_y - h*0.40),
                 (cx + w*0.30, base_y - h*0.24), n=16)
    right += bez((cx + w*0.30, base_y - h*0.24),
                 (cx + w*0.52, base_y - h*0.10),
                 (cx + w*0.5, base_y - h*0.06), n=12)
    base = bez((cx + w*0.5, base_y - h*0.06),
               (cx + w*0.2, base_y + h*0.07),
               (cx - w*0.2, base_y + h*0.07),
               (cx - w*0.5, base_y - h*0.06), n=24)
    ih = h * 0.42
    ib = base_y - h*0.02
    itip = (cx + lean*h*0.5, ib - ih)
    inner = bez((cx - w*0.18, ib), (cx - w*0.26, ib - ih*0.4),
                (cx - w*0.05, ib - ih*0.55), n=14)
    inner += bez((cx - w*0.05, ib - ih*0.55), (cx - w*0.08, ib - ih*0.8),
                 itip, n=10)
    inner += bez(itip, (cx + w*0.16, ib - ih*0.6),
                 (cx + w*0.20, ib - ih*0.25), n=10)
    inner += bez((cx + w*0.20, ib - ih*0.25), (cx + w*0.18, ib - ih*0.05),
                 (cx - w*0.18, ib), n=12)
    return [left + right + base, inner]

# ---------------------------------------------------------------- scene pieces

def draw_dog(d, rng, blink=False, w=9):
    # tail (behind body)
    stroke(d, bez((212, 780), (150, 760), (140, 700), n=14) +
           bez((140, 700), (136, 665), (166, 650), n=8), w, rng)
    # body
    fill_stroke(d, ellipse_arc(370, 730, 170, 205, 0, 360), w, rng)
    # haunch
    stroke(d, bez((300, 855), (390, 880), (455, 815), n=20), w, rng)
    # front leg + paw
    stroke(d, bez((462, 690), (474, 790), (470, 895), n=18), w, rng)
    stroke(d, bez((470, 895), (492, 912), (528, 905), n=8), w, rng)
    # ear (drawn before head so the head covers its inner edge)
    ear = bez((348, 292), (252, 302), (222, 430), n=18)
    ear += bez((222, 430), (210, 505), (272, 552), n=16)
    ear += bez((272, 552), (312, 570), (330, 500), n=10)
    ear += bez((330, 500), (340, 420), (348, 292), n=16)
    fill_stroke(d, ear, w, rng)
    # head
    fill_stroke(d, ellipse_arc(400, 415, 148, 140, 0, 360), w, rng)
    # snout: paper patch over the head edge, then the muzzle outline
    snout_arc = bez((492, 352), (606, 358), (636, 428), n=18)
    snout_arc += bez((636, 428), (646, 484), (588, 512), n=14)
    snout_arc += bez((588, 512), (560, 524), (524, 514), n=8)
    fill_only(d, snout_arc + [(520, 470), (500, 400)])
    stroke(d, snout_arc, w, rng)
    # nose
    fill_stroke(d, ellipse_arc(612, 410, 22, 17, 0, 360, n=20), max(w-2,3), rng)
    # mouth
    stroke(d, bez((588, 472), (556, 486), (528, 480), n=10), max(w-2,3), rng)
    # eye
    if blink:
        stroke(d, bez((420, 388), (442, 396), (464, 388), n=8), w, rng)
    else:
        d.ellipse([428, 372, 456, 400], fill=INK)
    # eyebrow
    stroke(d, bez((414, 340), (444, 328), (474, 338), n=10), max(w-2,3), rng)

def draw_table(d, rng, w=9):
    ty = 668
    stroke(d, [(598, ty), (962, ty)], w, rng)
    stroke(d, [(628, ty), (618, 952)], w, rng)
    stroke(d, [(932, ty), (942, 952)], w, rng)
    # mug
    mx = 726
    stroke(d, bez((mx-44, ty-4), (mx-48, ty-58), (mx-42, ty-104), n=14), w, rng)
    stroke(d, bez((mx-42, ty-104), (mx, ty-116), (mx+42, ty-104), n=12), w, rng)
    stroke(d, bez((mx+42, ty-104), (mx+48, ty-58), (mx+44, ty-4), n=14), w, rng)
    stroke(d, bez((mx+46, ty-88), (mx+88, ty-84), (mx+86, ty-46), n=12) +
           bez((mx+86, ty-46), (mx+84, ty-30), (mx+46, ty-34), n=8), w, rng)
    # steam
    stroke(d, bez((mx-8, ty-140), (mx-24, ty-172), (mx-2, ty-196), n=10) +
           bez((mx-2, ty-196), (mx+16, ty-220), (mx-4, ty-248), n=10), max(w-3,3), rng)

# (x, baseline y, height, width, lean) for the flames around the scene
FLAMES = [
    (115, 1010, 330, 170, -0.10),
    (905, 1015, 400, 200,  0.08),
    (1005, 640, 260, 130,  0.14),
    (25,  615, 230, 115, -0.16),
    (720, 1030, 120,  70,  0.03),
    (470, 1032, 105,  62, -0.04),
]

# ---------------------------------------------------------------- composition

def compose(size=1024, phase=1.0, blink=False, alpha=False, seed=SEED, w=9):
    """phase in [0,1) animates flame height/lean; blink closes the eye."""
    rng = random.Random(seed)
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0) if alpha else PAPER)
    layer = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, (fx, fb, fh, fw, lean) in enumerate(FLAMES):
        ph = 1.0 + 0.16 * math.sin(phase * 2 * math.pi + i * 1.7)
        ln = lean + 0.05 * math.sin(phase * 2 * math.pi + i * 2.3)
        for st in flame_strokes(fx, fb, fh * ph, fw, ln):
            stroke(d, st, w, rng)
    draw_table(d, rng, w)
    draw_dog(d, rng, blink=blink, w=w)
    if size != 1024:
        layer = layer.resize((size, size), Image.LANCZOS)
    img.alpha_composite(layer)
    return img

def favicon(size=64, seed=7):
    rng = random.Random(seed)
    img = Image.new("RGBA", (256, 256), PAPER)
    d = ImageDraw.Draw(img)
    for st in flame_strokes(128, 218, 165, 95, 0.06):
        stroke(d, st, 11, rng)
    return img.resize((size, size), Image.LANCZOS)

def animated_gif(path, size=480, n_frames=6, duration_ms=150):
    """Flickering flames, one blink. A single shared 16-colour palette with
    dithering off keeps the frames free of colour fringing."""
    raw = [compose(size, phase=i / n_frames, blink=(i == 4), seed=SEED)
           for i in range(n_frames)]
    pal = raw[0].convert("RGB").quantize(colors=16, dither=Image.NONE)
    frames = [fr.convert("RGB").quantize(palette=pal, dither=Image.NONE)
              for fr in raw]
    frames[0].save(path, save_all=True, append_images=frames[1:],
                   duration=duration_ms, loop=0, optimize=True, disposal=1)

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    p = lambda name: os.path.join(out, name)
    compose(1024).convert("RGB").save(p("emblem-paper-1024.png"))
    compose(512).convert("RGB").save(p("emblem-paper-512.png"))
    compose(1024, alpha=True).save(p("emblem-alpha-1024.png"))
    favicon(64).convert("RGB").save(p("flame-favicon-64.png"))
    favicon(32).convert("RGB").save(p("flame-favicon-32.png"))
    animated_gif(p("thisisfine-animated-480.gif"))
    print("wrote 6 assets to", out)

if __name__ == "__main__":
    main()
