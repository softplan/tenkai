#!/bin/bash

npm run build
docker build -t  softplan/tenkai-web . --no-cache


