#!/bin/sh
HTDOCS_FOLDER=$1

echo "###### Variables #####"
echo "HTDOCS_FOLDER $HTDOCS_FOLDER"
echo "API_URL $API_URL"
echo "API_DOCKER_URL $API_DOCKER_URL"
echo "KEYCLOAK_URL $KEYCLOAK_URL"
echo "KEYCLOAK_REALM $KEYCLOAK_REALM"
echo "######################"

echo "Before: ${HTDOCS_FOLDER}/keycloak.json"
cat ${HTDOCS_FOLDER}/keycloak.json

if [ "$API_URL" ]; then
    echo find "$HTDOCS_FOLDER" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
    find "$HTDOCS_FOLDER" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8080~'"$API_URL"'~g' {} \;
fi

if [ "$API_DOCKER_URL" ]; then
    echo find "$HTDOCS_FOLDER" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8081~'"$API_DOCKER_URL"'~g' {} \;
    find "$HTDOCS_FOLDER" -type f -name '*.js' -exec sed -i 's~http:\/\/localhost\:8081~'"$API_DOCKER_URL"'~g' {} \;
fi

if [ "$KEYCLOAK_URL" ]; then
    echo sed -i 's~http:\/\/keycloaktools\/auth~'"$KEYCLOAK_URL"'~g' ${HTDOCS_FOLDER}/keycloak.json
    sed -i 's~http:\/\/keycloaktools\/auth~'"$KEYCLOAK_URL"'~g' ${HTDOCS_FOLDER}/keycloak.json
fi

if [ "$KEYCLOAK_REALM" ]; then
    echo sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' ${HTDOCS_FOLDER}/keycloak.json
    sed -i 's~tenkai~'"$KEYCLOAK_REALM"'~g' ${HTDOCS_FOLDER}/keycloak.json
fi


echo "After: ${HTDOCS_FOLDER}/keycloak.json"
cat ${HTDOCS_FOLDER}/keycloak.json

echo "Up and running!"
