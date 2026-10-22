#!/usr/bin/env python3
"""Prepare the site's multiply-blended variants. Prepared for Kuber Mehta."""
from pathlib import Path
import sys
from PIL import Image, ImageSequence
raw = Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/internetonfire-art')
out = Path(sys.argv[2] if len(sys.argv)>2 else 'assets')
out.mkdir(parents=True, exist_ok=True)
def white_paper(image):
    image=image.convert('RGB')
    image.putdata([(255,255,255) if max(pixel)>205 else pixel for pixel in image.getdata()])
    return image
white_paper(Image.open(raw/'emblem-paper-1024.png')).save(out/'emblem.png')
for size in (32,64):
    white_paper(Image.open(raw/f'flame-favicon-{size}.png')).save(out/f'favicon-{size}.png')
frames=[white_paper(frame) for frame in ImageSequence.Iterator(Image.open(raw/'thisisfine-animated-480.gif'))]
frames[0].save(out/'emblem.gif',save_all=True,append_images=frames[1:],duration=260,loop=2,optimize=True)
