const express = require('express');
const app = express();
// Allows express to understand graphql and interact with graphql API
// It is used as middleware for a single route
const graphqlHTTP = require('express-graphql')
//require schema
const schema = require('./lib/schema/schema')

//update the object passed to graphqlHTTP()
app.use('/graphql-pets', graphqlHTTP({
  schema: schema,
  //graphql allows us to query from browser
  graphiql: true
}))

app.listen(3001, ()=> {
  console.log("Listening for requests on port 3001")
});
