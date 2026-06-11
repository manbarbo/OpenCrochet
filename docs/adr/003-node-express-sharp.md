# ADR 003: Use Node.js 20 + Express + Sharp for Backend

## Status

Accepted

## Context

For the API backend, we needed a lightweight, fast image processing server. We evaluated:

1. **Python + Flask + Pillow** — Mature but creates a polyglot codebase.
2. **Node.js + Fastify + Jimp** — Fastify is fast, but Jimp is pure JavaScript and slower.
3. **Node.js 20 + Express + Sharp** — Familiar Express API, Sharp is a native C++ binding to libvips, extremely fast.

## Decision

We chose **Node.js 20 + Express + Sharp** because:

- **Express**: Minimal, familiar, huge ecosystem, easy to test with Supertest.
- **Sharp**: Native C++ bindings to libvips, 4-5x faster than pure JavaScript alternatives.
- **Node.js 20**: LTS with stable fetch API, test runner, and improved performance.
- **TypeScript Strict**: Same type safety benefits as frontend.

## Consequences

- Sharp requires native compilation; Docker ensures consistent builds.
- Image processing is CPU-intensive; we may need to scale horizontally for high load.
- Multer is used for file uploads with disk storage.
- Swagger UI is served via `swagger-ui-express` for API documentation.

## References

- [Sharp documentation](https://sharp.pixelplumbing.com/)
- [Express documentation](https://expressjs.com/)
- [libvips](https://www.libvips.org/)
