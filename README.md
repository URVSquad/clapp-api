# BeTogether AWS

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
      "creation": null
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
  "events": []
}
```

- POST `/users/create`

```bash
curl 'http://localhost:3000/dev/users/create' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234"}'
```
