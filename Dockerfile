FROM node:24-alpine

WORKDIR /app

COPY . .
RUN chmod +x docker-entrypoint.sh

# DATABASE_URL/SESSION_SECRET aren't known at build time, only at `docker run` time.
# npm ci triggers `postinstall: prisma generate`, which needs prisma/schema.prisma present.
ENV SKIP_ENV_VALIDATION=1
RUN npm ci
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
