#!/bin/sh

echo $API_URL >> /tmp/variables.txt

if [ -n "$API_URL" ]; then
    find "$1" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
fi

echo $KEYCLOAK_URL >> /tmp/variables.txt

if [ -n "$KEYCLOAK_URL" ]; then
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~http:\/\/keycloaktools\/auth~'"$KEYCLOAK_URL"'~g' {} \;
fi

echo $KEYCLOAK_REALM >> /tmp/variables.txt

if [ -n "$KEYCLOAK_REALM" ]; then
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' {} \;
fi
