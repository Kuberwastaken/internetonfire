Use your image generation model to create a social share card (Open Graph / Twitter "summary_large_image" / LinkedIn link preview) for a website called "internetonfire". Do NOT write code to draw it; generate the image with the image model. Save the final file as ./og.png in the current directory. If the model cannot output exactly 1200x630, generate at the closest 1.91:1 landscape size and then resize/crop it to exactly 1200x630 pixels (e.g. with `sips` or `ffmpeg`), keeping the composition intact. Generate 3 variations as og-1.png, og-2.png, og-3.png, then copy the best one to og.png.

WHAT THE SITE IS: a minimal, community-maintained tracker of recent cybersecurity and AI incidents (breaches, backdoored npm/PyPI packages, exploited bugs). The joke is the "This is fine" meme: the internet is burning, everyone is calmly sipping coffee. Audience: Hacker News and X/Twitter engineers. It must look tasteful and designed, like a Linear/Vercel/Stripe-quality card, not clip-art, not AI-slop, no gradients-everywhere, no glow effects, no neon, no hacker-hoodie stock imagery, no padlocks, no matrix code, no binary digits.

CANVAS: 1200x630 px landscape, 1.91:1. Flat solid off-white background #FAFAF8. Generous whitespace.

SAFE ZONE (critical): X crops nothing at 1.91:1 but LinkedIn and some chat apps crop the edges and round the corners, and some feeds show it as small as 500px wide. So: keep every piece of text and the main subject inside the central 1080x540 area (60px margin left/right, 45px top/bottom). Nothing important touches the edges. Text must be readable when the whole card is shrunk to 500px wide, so no text smaller than ~28px at full size.

LAYOUT: two columns.
- LEFT column (about 55% width, left-aligned, vertically centered as a block):
  1. A small brand line at the top: a tiny solid orange flame glyph (#E8470E) followed by the lowercase word "internetonfire" in a bold modern grotesk sans-serif (Inter / Helvetica Now style), near-black #111110, about 30px.
  2. The headline, very large, heavy weight (800), tight letter-spacing (negative tracking), near-black #111110, on exactly two lines:
     "The internet"
     "is on fire."
     About 100px cap height. Perfect, crisp, correctly spelled typography. The period after "fire" is included.
  3. Under it, one line in medium grey #5B5A56, regular weight, about 34px: "This is fine."
  4. At the bottom of the column, small grey #8A8882 text about 26px: "kuber.studio/internetonfire"
- RIGHT column (about 45% width): an original flat editorial illustration, thick clean black outlines, limited palette (warm yellow #F5C842, fire orange #E8470E, deep orange #C43C0A, black, off-white, a little muted olive/grey for smoke). Subject: a calm cartoon dog wearing a small bowler hat sits at a small wooden table holding a white coffee mug, smiling contentedly, while a giant web-browser window behind/around it is on fire. The browser window is drawn as a simple rounded rectangle with three small dots in the top-left corner and an empty address bar; flat stylized orange/yellow flames rise from inside the window and lick out of its edges, and a few small browser tabs at the top are also on fire. A soft dark smoke cloud band hangs across the top of the browser window. The dog is not panicking at all. Composition: illustration contained in its column, slightly overlapping nothing, not touching the canvas edges. Drawn in the style of a modern webcomic, simple shapes, no shading gradients, no 3D, no photorealism.

ACCENT DETAIL (optional, subtle): along the bottom-left under the URL, a tiny row of about 20 thin vertical orange (#EA580C) bars of varying heights, rising toward the right, like a minimal bar chart of incidents per day. Only if it stays clean; omit if it adds clutter.

ABSOLUTELY AVOID: any other text, any misspelled words, watermarks, signatures, logos of real companies, borders/frames around the whole card, drop shadows, gradients on the background, emoji, skulls, padlocks, hooded hackers, circuit boards, glowing effects.

When done, print the final file path and its pixel dimensions.
