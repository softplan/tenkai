#!/bin/sh

echo "###### variaveis #####"
echo "$1"
echo "$API_URL"
echo "$KEYCLOAK_URL"
echo "$KEYCLOAK_REALM"
echo "######################"

if [ "$API_URL" ]; then
    echo find "$1" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
    find "$1" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
fi

echo $KEYCLOAK_URL >> /tmp/variables.txt

if [ "$KEYCLOAK_URL" ]; then
    echo sed -i 's~http:\/\/keycloaktools\/auth~'"$KEYCLOAK_URL"'~g' /var/www/localhost/htdocs/keycloak.json
    sed -i 's~http:\/\/keycloaktools\/auth~'"$KEYCLOAK_URL"'~g' /var/www/localhost/htdocs/keycloak.json
    cat /var/www/localhost/htdocs/keycloak.json
fi

if [ "$KEYCLOAK_REALM" ]; then
    echo find "$1" -type f -name 'keycloak.json' -exec sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' {} \;
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' {} \;
fi
