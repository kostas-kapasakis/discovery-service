# Discovery-service

NodeJS Restful Discovery Service

## Description

NodeJs Express Rest api which implements a service Discovery functionality.

The api is using the express framework to expose the necessary http endpoints.

MongoDB is used to store any app instance.

Self-Cleaning configurable mechanism is set up in order to remove any instances that has not sent any heartbeats in a
specific time period.

Open api specification has been set up as an api documentation which can be accessed through the /docs endpoint/

Endpoints supported :

- get '/' :
    - will return the list of groups


- get '/group' :
    - will return the list of the groups instances


- post '/:group/:id':

  - will register the group if doesnt exist and new instance.If both exist will just update the updatedAt value.
  - will return the new instance that was created
- delete '/:group/:id':

  - will delete the instance
  - will return the new instance that was deleted

- get '/docs' in the browser:
  - will navigate you to the swagger ui and the api documentation

## How to run the api

1) Add one .env file with the following structure

```
DB_CONNECTION_STRING=mongoconnectionstring
APP_INSTANCE_AGE: 60000
NODE_ENV:'development'
```

2) In case you want to use a local mongodb create a groups and a instances collection.
3) You could also use the below test user credentials and the following connection string.

- user: **test**
- pass: **test**
- connection string : **mongodb+srv://test:
  test@discoveryservice-cluste.xaue6.mongodb.net/discovery-service?retryWrites=true&w=majority**

### With Docker

1) ``docker build -t discovery-service .``
2) `` docker run -p 3000:3000 discovery-service``

### without docker

1) ``npm i``
2) ``npm run start:dev``

## How to run the tests and code coverage

1) ``npm run test``

## CI pipeline

Github actions have been used to support a basic build and run test pipeline You can access the pipeline from the
following link https://github.com/kostas-kapasakis/discovery-service/actions/workflows/node.js.yml


