# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "email" : "mohammedsopyan@gmail.com",
  "password" : "rahasia",
  "name" : "Mohammed Sopyan"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "email" : "mohammedsopyan@gmail.com",
    "name" : "Mohammed Sopyan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email" : "mohammedsopyan@gmail.com",
  "password" : "rahasia"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "sopyan",
    "name" : "Mohammed Sopyan",
    "token" : "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Email or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "sopyan",
    "name" : "Mohammed Sopyan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :
- Authorization: token

Request Body :

```json
{
  "password" : "rahasia", // optional, if want to change password
  "name" : "Mohammed Sopyan" // optional, if want to change name
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "sopyan",
    "name" : "Mohammed Sopyan"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : true
}
```
