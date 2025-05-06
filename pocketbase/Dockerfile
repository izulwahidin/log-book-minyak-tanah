FROM alpine:latest

ARG PB_VERSION=0.27.2

RUN apk add --no-cache \
    unzip \
    curl \
    ca-certificates

# Download and unzip PocketBase binary
RUN curl -L -o /tmp/pb.zip https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip

# Optional: Copy in migrations/hooks if you have them
# COPY ./pb_migrations /pb/pb_migrations
# COPY ./pb_hooks /pb/pb_hooks

# Volume for persistent database
VOLUME ["/pb_data"]

EXPOSE 8080

# Start PocketBase server
CMD ["/pocketbase", "serve", "--http=0.0.0.0:8080"]
