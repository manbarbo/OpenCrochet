# ADR 004: Use Docker for Development and Deployment

## Status

Accepted

## Context

We needed consistent environments across developer machines and production. We evaluated:

1. **Local development only** — Fastest to start but "works on my machine" issues.
2. **Docker for production only** — Still has environment inconsistencies during development.
3. **Docker for both development and production** — Full consistency, easy onboarding, production-like locally.

## Decision

We chose **Docker for both development and production** because:

- **Consistency**: Same Node.js version, same Sharp binaries, same OS everywhere.
- **Onboarding**: New developers only need Docker installed; no global Node.js or pnpm required.
- **Production parity**: Development environment closely mirrors production.
- **Multi-stage builds**: Frontend is built in Docker, backend runs natively in container.
- **docker-compose**: Single command (`pnpm dev`) starts all services.

## Consequences

- All developers must install Docker Desktop.
- File watchers need to be configured for bind mounts.
- Hot reload requires volume mapping and `nodemon`/`vite --host`.
- Production builds are optimized via multi-stage Dockerfiles.

## References

- [Docker documentation](https://docs.docker.com/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
