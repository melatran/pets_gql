//connect to db
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
    GraphQLList,
    GraphQLSchema
} = graphql;

//define pet type
//what kind of info user can ask for
const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    animal_type: { type: GraphQLString },
    breed: { type: GraphQLString },
    age: { type: GraphQLInt },
    favorite_treat: { type: GraphQLString },
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        return database('pets')
          .join('owners', { 'pets.owner_id': 'owners.id' })
          .where('owners.id', parent.owner_id)
          .first()
      }
    }
  })
})

//define owner type
const OwnerType = new GraphQLObjectType({
  name: "Owner",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    pets: {
      type: GraphQLList(PetType),
      resolve(parent, args) {
        return database('owners')
          .join('pets', { 'owners.id': 'pets.owner_id' })
          .where('pets.owner_id', parent.id)
      }
    }
  })
})

//using 'GraphQlList' so we need to add to the top
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      //returns a single pet by id
      pet: {
        type: PetType,
        args: {id: {type: GraphQLID}},
        resolve(parent, args){
          return database('pets').where('id', args.id).first()
        }
      },
      //returns all pets
      pets: {
        type: new GraphQLList(PetType),
          resolve(parent, args){
            return database('pets').select()
          }
      },
      owner: {
        type: OwnerType,
        args: {id: {type: GraphQLID}},
        resolve(parent, args){
          return database('owners').where('id', args.id).first()
        }
      },
      owners: {
        type: GraphQLList(OwnerType),
        resolve(parent, args){
          return database('owners').select()
        }
      }
    }
});

//export schema so index.js can access it
module.exports = new GraphQLSchema({
    query: RootQuery
});