# Language Icons

SVG sources vendored from [Devicon](https://devicon.dev) (MIT-licensed), `-original` (colored) variants. All product names, logos, and brands are property of their respective owners.

To update an icon, fetch the latest `*-original.svg` from
`https://raw.githubusercontent.com/devicons/devicon/master/icons/<lang>/<lang>-original.svg`
and replace the file. The SVGs are read at build time via Vite's `?raw` import
and rendered through `language-icon.tsx`.
