# pets_gql

An example repo for backend module 4 graphql lesson.

## Getting Started

* Clone the repo and navigate to the project directory

* Create the database

```
psql
CREATE DATABASE furbabies;
\q
```

* Install packages `npm install`

* Run migrations `knex migrate:latest`

* Seed database `knex seed:run`

* Run GraphQL `node index.js`

* Local `localhost:3001/graphql-pets`