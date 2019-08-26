# Tenkai

An open platform to configure, deploy and manage microservices based on Helm Charts.

In this README:

- [Introduction](#introduction)
- [A demo deployment](#demo-deployment)
- [A production deployment](#production-deployment)

## Introduction

Configure the relationships between hundreads of microservices is always a headache.
In this context Tenkai comes to help you to configure and centralize your environment's variables. Tenkai is using the best of Helm tool, bring us a Web GUI interface that show us our Helm Charts from our repositories and allow us to easy configure and deploy them.
Besides that, Tenkai has a strong integration with Istio Service Mesh, abstracting the process of defining a virtualservices, injecting istiocar and handle traffic management rules (as canary deployments). If you need to handle dependencies between services, Tenkay could help you to track your services versions and to verify which of them are already deployed and which of them are in old versions and depending of deployment.


## Demo Deployment

### Pre-requirements

- Keycloak

Tenkai is integrate to keycloak, for tests purposes you need only to run a simple keycloak docker container:

```
docker run -d -p 8180:8080 -e KEYCLOAK_USER=admin -e \
KEYCLOAK_PASSWORD=admin -v $(pwd):/tmp --name kc \
jboss/keycloak
```
Inside keycloak dashboard, you must create a Realm called "tenkai" as well a  Client called "tenkai". 
For demo purposes, you should create 2 roles:
* tenkai-admin
* tenkai-user

So, create you user and associate them to this roles.

### Deployment of Tenkai-api

In a demo environment, you should only run the container without any adicional parameters.

```
docker run --name tenkai-api -p 8080:8080 -d softplan/tenkai-api:dev
```
### Deployment of Tenkai GUI

You must pass the API_URL, KEYCLOAK_URL and KEYCLOAK_REAML environment variables.

```
docker run --name tenkai-web -p 3001:80 -e API_URL=http://localhost:8080 -e KEYCLOAK_URL=http://localhost:8180/auth -e KEYCLOAK_REALM=tenkai -d softplan/tenkai-web:dev
```

## Production Deployment

=> In construction.




