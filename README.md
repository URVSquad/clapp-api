# BeTogether AWS

## Endpoints
- GET `/activity`

```bash
curl 'curl http://localhost:3000/dev/activities'
```

```json
[
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
```

- POST `/activities/create`

```bash
curl 'http://localhost:3000/dev/activities/create' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234"}'
```

- POST `/users/create`

```bash
curl 'http://localhost:3000/dev/users/create' --data '{"title":"Title", "image":"base64", "description":"Description", "category":"1", "app_user":"1234"}'
```
