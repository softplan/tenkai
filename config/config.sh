#!/bin/sh

echo $API_URL >> /tmp/variables.txt

if [ "$API_URL" ]; then
	  echo "replacing $API_URL" >> /tmp/variables.txt
    find "$1" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
fi

echo $KEYCLOAK_URL >> /tmp/variables.txt

if [ "$KEYCLOAK_URL" ]; then
	  echo "replacing $KEYCLOAK_URL" >> /tmp/variables.txt
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~http:\/\/keycloaktools\/auth~'"$KEYCLOAK_URL"'~g' {} \;
fi

echo $KEYCLOAK_REALM >> /tmp/variables.txt

if [ "$KEYCLOAK_REALM" ]; then
	  echo "replacing $KEYCLOAK_REALM" >> /tmp/variables.txt
    find "$1" -type f -name 'keycloak.json' -exec sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' {} \;
fi
