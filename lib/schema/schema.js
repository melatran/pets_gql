//connection to database
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

//require graphql package so we can use it to define our object types
const graphql = require('graphql');

//require GraphQL datatypes
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

//define pet type
//what kind of info user can ask for
const PetType = new GraphQLObjectType({
    name: 'Pet',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        animal_type: {type: GraphQLString},
        breed: {type: GraphQLString},
        age: {type: GraphQLInt},
        favorite_treat: {type: GraphQLString}
    })
});

//return all pets
//using 'GraphQlList' so we need to add to the top
//graphqllist will reuturn list of graphql objects
//we are using db to get back info, we need to add the connection to the top
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        pets: {
            type: new GraphQLList(PetType),
            resolve(parent, args){
                return database('pets').select()
            }
        }
    }
});

//export schema so index.js can access it

module.exports = new GraphQLSchema({
    query: RootQuery
});