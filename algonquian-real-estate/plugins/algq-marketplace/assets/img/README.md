# Image assets

Binary PNG placeholders were intentionally removed from source control so this branch can pass repository push restrictions that reject binary blobs.

Production artwork should be exported by the design/media pipeline and uploaded through WordPress Media Library or attached by a release artifact process using these expected filenames:

- `plugin-icon.png`
- `product-package.png`
- `marketplace-ui-mockup.png`

The plugin CSS and JavaScript do not require these files to load without fatal errors.
