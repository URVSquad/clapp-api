# BeTogether AWS
This project uses the [Serverless Framework](https://github.com/serverless/serverless) to define an Serverless API in AWS.

## Requirements
To run this project you'll need to setup the following environment variables in your system:

- `BT_DB_NAME` 
- `BT_DB_HOST`
- `BT_DB_PORT` 
- `BT_DB_USER` 
- `BT_DB_PASSWORD` 


## How to run
Once you clone this project locally you can run it offline by doing:
``` 
npm install
serverless offline
```

Then, you'll be able to curl the following endpoints in your local machine.

## Endpoints
GET `/activities`

```bash
curl -X GET 'http://localhost:3000/dev/activities'
```

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

POST `/activities`

```bash
curl -X POST 'http://localhost:3000/dev/activities' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234"}'
```


```json
{
  "status": 200,
  "activity": {
    "title": "Title",
    "image": "base64",
    "description": "Description",
    "category": "1",
    "app_user": "1234",
    "id": 15
  }
}
```

GET `/events/`
```bash
curl -X GET http://localhost:3000/dev/events
```

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

POST `/events`

```bash
curl -X POST 'http://localhost:3000/dev/events' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234", "event_start":"2020-04-09 09:08:49", "event_end":"2020-04-09 15:08:49"}'
```

```json
{
  "status": 200,
  "event": {
    "title": "Title",
    "image": "base64",
    "description": "Description",
    "category": "1",
    "app_user": "1234",
    "event_start": "2020-04-09 09:08:49",
    "event_end": "2020-04-09 15:08:49",
    "id": 25
  }
}
```

- POST `/users/create`

```bash
curl 'http://localhost:3000/dev/users/create' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234"}'
```
