#!/bin/sh
if [ -n "$API_URL" ]; then
    find "$1" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
fi
if [ -n "$KEYCLOAK_URL" ]; then
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~http:\/\/keycloak-tools\/auth~'"$KEYCLOAK_URL"'~g' {} \;
fi
if [ -n "$KEYCLOAK_REALM" ]; then
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' {} \;
fi
