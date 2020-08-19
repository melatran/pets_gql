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

## Resources

1. [Setup Graphql Node Server](https://gist.github.com/jwill9999/c1fcd9ca2d80e33515f22b509526f696)

2. [GraphQL Lesson Queries](https://github.com/melatran/backend-curriculum-site/blob/gh-pages/module4/lessons/pets_gql_walkthrough_queries.md)

3. [GraphQL Lesson Mutations](https://github.com/melatran/backend-curriculum-site/blob/gh-pages/module4/lessons/pets_gql_walkthrough_mutations.md)
