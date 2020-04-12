# Clapp API
Backend API for [Clapp](https://github.com/URVSquad/clapp).

## Context
This is a [Serverless Framework](https://github.com/serverless/serverless) project implementing
an API to interface with the Clapp backend.

## Running Locally
You can clone this project and test the implemented endpoints in your local machine, which will act as the server.

> Please note that, while running the project locally allows you to 'mock' APIGateway and Lambda in your machine, you will still be connecting to other external services such as Cognito and RDS.

Once your system fulfills the requirements described below, you'll be able to start this by doing:
```bash
serverless offline
```
Then, a local HTTP server will be started and you'll be able to run a `curl` against the endpoints defined by the project.


### Requirements
#### Serverless CLI
As this is a Serverless project, you'll need to install the Serverless CLI, which in time depends on Node. Find detailed instructions [here](https://serverless.com/framework/docs/providers/aws/guide/installation/).

#### Dependencies
Once you have the Serverless CLI installed, you will need to locally install the project dependencies. These are already defined in `package.json`, so you just need to run:

```bash
npm install
```

#### Environment Variables
You will need to setup the following environment variables in your system.

Database credentials
- `BT_DB_NAME` 
- `BT_DB_HOST`
- `BT_DB_PORT` 
- `BT_DB_USER` 
- `BT_DB_PASSWORD` 

## Deploying to AWS
Once you finish testing your changes locally you may want to deploy the application into AWS. You'll be able to do so by simply running:
```bash
serverless deploy
```
> Beware, this will use the local AWS credentials in your machineto create all kinds of resources and configurations in your AWS account.

## API Endpoints

### GET `/activities`
```bash
curl -X GET 'http://localhost:3000/dev/activities'
```

#### Response

```json
{
  "status": 200,
  "activities": [
    {
      "id": 1,
      "title": "This is the title",
      "image": null,
      "description": "This is the description",
      "category": 1,
      "app_user": "1234",
      "creation": "2020-04-09T07:19:29.000Z"
    }
  ]
}
```

### POST `/activities`

```bash
curl -X POST 'http://localhost:3000/dev/activities' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234"}'
```

#### Response
```json
{
  "status": 200,
  "activity": {
    "title": "Title",
    "image_url": "http://example.com",
    "description": "Description",
    "category": "1",
    "app_user": "1234",
    "id": 15
  }
}
```

### GET `/events/`
```bash
curl -X GET http://localhost:3000/dev/events
```

#### Response
```json
{
  "status": 200,
  "events": [
    {
      "id": 24,
      "title": "Title",
      "image": {
        "type": "Buffer",
        "data": [
          98,
          97,
          115,
          101,
          54,
          52
        ]
      },
      "description": "Description",
      "category": 1,
      "app_user": "1234",
      "creation": "2020-04-09T08:16:00.000Z",
      "event_start": "0000-00-00 00:00:00",
      "event_end": "0000-00-00 00:00:00"
    }
  ]
}
```

### POST `/events`

```bash
curl -X POST 'http://localhost:3000/dev/events' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234", "event_start":"2020-04-09 09:08:49", "event_end":"2020-04-09 15:08:49"}'
```

#### Response
```json
{
  "status": 200,
  "event": {
    "title": "Title",
    "image_url": "http://example.com",
    "description": "Description",
    "category": "1",
    "app_user": "1234",
    "event_start": "2020-04-09 09:08:49",
    "event_end": "2020-04-09 15:08:49",
    "id": 25
  }
}
```
