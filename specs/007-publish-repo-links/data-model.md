# Data Model: Publish the Blueprint and Links Slide

- **Link** — `id` (deck | repo), `label`, `url`, `qr` (`public/qr/<id>.svg`). Validation: QR decodes to exactly `url`.
- **Repository** — `owner/name` = `400kelvins/ai-driven-sdlc`, visibility public, published ref = `main` only.
