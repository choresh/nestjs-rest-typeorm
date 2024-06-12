

## Description

Sample of NestJs app with REST api and TypeOrm.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Use
  * Call root route: 
    * GET http://localhost:3000.
  * Call users routes:
    * Get all users: GET http://localhost:3000/users.
    * Get some users: GET http://localhost:3000/users/some?firstName=< first name >&lastName=< last name > &isActive=< true or false >
    * Get one user: GET http://localhost:3000/users/< id >.
    * Create one user: POST http://localhost:3000/users (the request's body should be: {"firstName": "< first name >","lastName": "< last name >"}).
    * Update one user: PATCH http://localhost:3000/users/< id > (the request's body should be like: {"firstName": "< new first name >"}).
    * Delete one user: DELETE http://localhost:3000/users/< id >.
    * Export all users: GET http://localhost:3000/users/export (if invoked from browser - a JSON file be downloaded automaticly).
    * Import many users: POST http://localhost:3000/users/import (the request's body should be a 'form-data', and the referred file should be like [users.json](test\data\users.json)).