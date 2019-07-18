FROM alpine:3.8

EXPOSE 80

ADD config/default.conf /etc/nginx/conf.d/default.conf
ADD config/config.sh /tmp

COPY build/. /var/www/localhost/htdocs

RUN apk add nginx && mkdir /run/nginx 

CMD ["/bin/sh", "-c", "/tmp/config.sh /var/www/localhost/htdocs && exec nginx -g 'daemon off;';"]

WORKDIR /var/www/localhost/htdocs

