# Social card

`assets/og.jpg` (1200x630) was generated with the Codex CLI image model from `prompt.md`, then converted to JPEG:

```sh
codex exec -s workspace-write --skip-git-repo-check - < tools/og/prompt.md
sips -s format jpeg -s formatOptions 90 og.png --out assets/og.jpg
```

The illustration is an original parody of K.C. Green's "This is fine".
