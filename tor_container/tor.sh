container_command() {
  if command -v podman > /dev/null ; then
    podman "$@"
  elif command -v docker > /dev/null ; then
    docker "$@"
  else
    echo "Error: Neither `podman` nor `docker` were found" 1>&2
  fi
}

dockerfile=$(cat << EOM
FROM alpine:edge

RUN apk update
RUN apk add tor

RUN echo "SocksPort 0.0.0.0:9050" >> /etc/tor/torrc

CMD tor
EOM
)

container_command build -t downloader - <<< "$dockerfile" && \
container_command run --rm -p 9050:9050 downloader
