#!/bin/bash

npm run build
docker build -t docker-unj-repo.softplan.com.br/unj/tenkai-web . --no-cache

