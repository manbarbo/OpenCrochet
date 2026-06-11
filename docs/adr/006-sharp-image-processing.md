# ADR 006: Use Sharp for Image Processing Over Canvas API

## Status

Accepted

## Context

For image processing (threshold, halftone, posterize, pixelate, grid generation), we evaluated:

1. **HTML5 Canvas API (client-side)** — No server needed, but slow for large images and blocks the main thread.
2. **Sharp (server-side)** — Native C++ via libvips, extremely fast, supports streaming.
3. **Jimp (server-side)** — Pure JavaScript, slower, but no native dependencies.

## Decision

We chose **Sharp (server-side)** because:

- **Performance**: Processes 1000x1000 images in under 5 seconds (most filters under 40ms).
- **Quality**: Produces high-quality output with proper color space handling.
- **Streaming**: Supports streaming and pipeline operations.
- **Format support**: Handles JPEG, PNG, WebP, TIFF, SVG, PDF output.
- **Grid generation**: Can generate SVG grids directly from processed pixel data.

## Consequences

- Image processing requires server round-trip (upload → process → preview).
- API must handle file uploads and temporary storage.
- Native dependency means Docker is required for consistent builds.
- CPU-intensive operations may require rate limiting or queueing.

## References

- [Sharp performance benchmarks](https://sharp.pixelplumbing.com/performance)
- [libvips performance](https://www.libvips.org/)
