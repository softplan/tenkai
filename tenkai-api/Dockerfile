FROM ubuntu:18.04
ADD ca-certificates.crt /etc/ssl/certs/
WORKDIR app
ADD build/.helm/ /app/.helm/
ADD build/main /app
ADD app.yaml /app
CMD ["/app/main"]
