FROM alpine:3.8

EXPOSE 80

ADD config/default.conf /etc/nginx/conf.d/default.conf
ADD config/config.sh /tmp
ADD run.sh /tmp

COPY build/. /var/www/localhost/htdocs

RUN apk add nginx && mkdir /run/nginx 

WORKDIR /var/www/localhost/htdocs

ENTRYPOINT [ "/tmp/run.sh" ]
