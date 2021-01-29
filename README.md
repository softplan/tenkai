[![Build Status](https://travis-ci.org/softplan/tenkai.svg?branch=dev)](https://travis-ci.org/softplan/tenkai)

# Tenkai

An open platform to configure, deploy and manage microservices based on Helm Charts.

In this README:

- [Tenkai](#tenkai)
  - [Introduction](#introduction)
  - [Demo Deployment](#demo-deployment)
    - [Pre-requirements](#pre-requirements)
      - [Keycloak](#keycloak)
      - [RabbitMQ](#rabbitmq)
    - [Deployment of Tenkai-api](#deployment-of-tenkai-api)
    - [Deployment of Tenkai-helm-api](#deployment-of-tenkai-helm-api)
    - [Deployment of Tenkai GUI](#deployment-of-tenkai-gui)
  - [Production Deployment](#production-deployment)

![alt text](screenshots/tenkai_helm.png)

## Introduction

Configure the relationships between hundreds of microservices is always a headache.
In this context Tenkai comes to help you to configure and centralize your environment's variables. Tenkai is using the best of Helm tool, bring us a Web GUI interface that show us our Helm Charts from our repositories and allow us to easy configure and deploy them.
Besides that, Tenkai has a strong integration with Istio Service Mesh, abstracting the process of defining a virtualservices, injecting istiocar and handle traffic management rules (as canary deployments). If you need to handle dependencies between services, Tenkai could help you to track your services versions and to verify which of them are already deployed and which of them are in old versions and depending of deployment.

## Demo Deployment

### Pre-requirements

- Keycloak
- RabbitMQ

#### Keycloak

Tenkai is integrated to keycloak, for tests purposes you need only to run a simple keycloak docker container:

```shell
docker run -d -p 8180:8080 -e KEYCLOAK_USER=admin -e \
KEYCLOAK_PASSWORD=admin -v $(pwd):/tmp --name kc \
jboss/keycloak
```

Inside keycloak dashboard, you must create a Realm called "tenkai" as well a Client called "tenkai".
For demo purposes, you should create 2 roles:

- tenkai-admin
- tenkai-user

So, create you user and associate them to these roles. Also enter a valid redirect URI:

- http://localhost:3000/admin/workload

#### RabbitMQ

Tenkai use queue's system to make install/upgrade of your services. So, you must provide for tenkai a connection with some RabbitMQ server. If you don't have any, you can just run RabbitMQ container:

```shell
docker run -d --hostname my-rabbit --name some-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

Once started, Tenkai will create all queues his need.

### Deployment of Tenkai-api

In a demo environment, you should only run the container without any adicional parameters.

```shell
docker run --name tenkai-api -e APP_RABBIT_URI=amqp://guest:guest@localhost:5672 -e APP_HELMAPIURL=http://localhost:8082 -p 8080:8080 -d softplan/tenkai-api:dev
```

### Deployment of Tenkai-helm-api

This service will be responsible to consume install/upgrade solicitations make from tenkai-api via RabbitMQ, the processing of this solicitation and send back a response to tenkai-api also via RabbitMQ. This service also communicates with tenkai-api via http protocol for some helm resources.

To run this service, execute:

```shell
docker run --name=tenkai-helm -d -e APP_RABBIT_URI=amqp://guest:guest@localhost:5672 -p 8082:8082 softplan/tenkai-helm-api:main
```

### Deployment of Tenkai GUI

You must pass the `API_URL`, `KEYCLOAK_URL` and `KEYCLOAK_REAML` environment variables.

```shell
docker run --name tenkai-web -p 3001:80 -e API_URL=http://localhost:8080 -e KEYCLOAK_URL=http://localhost:8180/auth -e KEYCLOAK_REALM=tenkai -d softplan/tenkai-web:dev
```

## Production Deployment

=> In construction.
