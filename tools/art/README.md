# Site illustration

Programmatic dog, mug and flames prepared for Kuber Mehta's internetonfire site. No downloaded artwork is used by this generator. The drawing is inspired by the familiar "this is fine" meme, not official Question Hound artwork. No affiliation, endorsement, exclusive ownership or legal clearance is asserted.

## Rebuild

With Python 3 and Pillow 12.3.0:

```sh
python3 tools/art/generate_emblem.py /tmp/internetonfire-art
python3 tools/art/prepare_site_assets.py /tmp/internetonfire-art assets
```

The first script uses a fixed seed to draw raw paper, transparent, favicon and six-frame GIF variants. The second converts bright paper pixels to white so CSS multiply blends them into the site's own notebook paper, slows the GIF to 260ms per frame and limits it to three cycles (under five seconds). The site switches the dog image to `emblem.png` for reduced-motion preferences. The raw transparent variant is not used in the site.

The source is reproducible with the stated Pillow version; other rasteriser versions may change exact bytes. These scripts perform no network requests and include no external credentials or private handwriting samples.
