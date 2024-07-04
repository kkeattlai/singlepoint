# FROM oven/bun:1 AS base
FROM oven/bun:alpine

WORKDIR /usr/src/app

# FROM base AS install
# RUN mkdir -p /temp/dev
# COPY package.json bun.lockb /temp/dev/
# RUN cd /temp/dev && bun install --frozen-lockfile

# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

# FROM base AS prerelease
# COPY --from=install /temp/dev/node_modules node_modules
# COPY . .

# FROM base AS release
# COPY --from=install /temp/prod/node_modules node_modules
# # COPY --from=prerelease /usr/src/app/index.ts .
# COPY --from=prerelease /usr/src/app/package.json .

# USER bun

COPY . .

RUN apk --no-cache add curl
RUN apk add --no-cache --upgrade bash

COPY health_check.sh /usr/local/bin/health_check.sh

RUN chmod +x /usr/local/bin/health_check.sh

# HEALTHCHECK --interval=5s --timeout=2s --retries=5 \
#     CMD sh /usr/local/bin/health_check.sh

# RUN sh /usr/local/bin/health_check.sh

RUN bun install
RUN bun run build

ENTRYPOINT [ "bun", "start" ]