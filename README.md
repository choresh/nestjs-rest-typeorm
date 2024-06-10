

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
    * GET http://localhost:3000/users.
    * GET http://localhost:3000/users/< id >.
    * POST http://localhost:3000/users/< CreateUserDto >.
    * PATCH http://localhost:3000/users/< id, UpdateUserDto >.
    * DELETE http://localhost:3000/users/< id >.