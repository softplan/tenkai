#!/bin/sh
if [ -n "$API_URL" ]; then
    find "$1" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
fi