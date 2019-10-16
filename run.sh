#!/bin/sh
sh /tmp/config.sh /var/www/localhost/htdocs
exec nginx -g 'daemon off;'
