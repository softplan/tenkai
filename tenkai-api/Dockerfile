FROM scratch
ADD ca-certificates.crt /etc/ssl/certs/
WORKDIR app
ADD build/main /app
ADD app.yaml /app
CMD ["/app/main"]
