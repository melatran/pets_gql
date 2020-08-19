# GraphQL Notes

## Constructing Types

- define a fixed schema when the application starts
- fields: describe to Graphql what a book looks like by describing the model schema (similar to attributes of objects)

```
const graphql = require('graphql');
const Book = require('../to/your/model');

// create a model type e.g book / author

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({ authorId: parent.id });
            }
        }
    })
});
```

## GraphQL Types

There are many types you can use when creating these qraphql schemas. [Link graphql/types](https://graphql.org/graphql-js/type/)

```
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;
```

## RootQuery

- each schema must contain a root query
- for example: how to get a book author or list of books or list of authors
- what information I can get from schema (join vs relationships)

```
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        }
    }
});
```

## Exposing the Schema

```
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
```

This exposes those methods (query and mutation)

## GraphQL Calls

Returning a list of pets for the owner

```
{
  owner(id: 1){
    id
    name
    age
    age
    pets{
      name
    }
  }
}
```

Returning a list of owners

```
{
  owners{
    id
    name
    age
    age
    pets{
      name
    }
  }
}
```

Return only info about owner

```
{
  owner(id: 1){
    id
    name
    age
  }
}
```

## Refactor

**Static:** defines static method for a class; aren't called on instances of the class (class method); often functions to create or clone objects

```
class ClassWithStaticMethod {
  static staticMethod() {
    return 'static method has been called.';
  }
}

console.log(ClassWithStaticMethod.staticMethod());
// expected output: "static method has been called."
```

**module.exports**

The CommonJS (CJS) format is used in Node.js and uses require and module.exports to define dependencies and modules. The npm ecosystem is built upon this format.

- when you have a module that exports just one thing

```
//user.js
class User {
  constructor(name, age, email) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  getUserStats() {
    return `
      Name: ${this.name}
      Age: ${this.age}
      Email: ${this.email}
    `;
  }
}

module.exports = User;
---------------------
//index.js

const User = require('./user');
const jim = new User('Jim', 37, 'jim@example.com');

console.log(jim.getUserStats());
----------------------
//log

Name: Jim
Age: 37
Email: jim@example.com
```

- after refactor and creating methods, we can just call on the methods in our schema

## Resources

1. [Setup Graphql Node Server](https://gist.github.com/jwill9999/c1fcd9ca2d80e33515f22b509526f696)

2. [GraphQL Lesson Queries](https://github.com/melatran/backend-curriculum-site/blob/gh-pages/module4/lessons/pets_gql_walkthrough_queries.md)

3. [GraphQL Lesson Mutations](https://github.com/melatran/backend-curriculum-site/blob/gh-pages/module4/lessons/pets_gql_walkthrough_mutations.md)

4. [Static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)

5. [Module Exports](https://www.sitepoint.com/understanding-module-exports-exports-node-js/)