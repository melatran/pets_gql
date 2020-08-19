//after refactor, connections have been moved to models so we need to require those files
const Pet = require('../models/pet')
const Owner = require('../models/owner')

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
        return Pet.findPetOwners(parent.owner_id)
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
        return Owner.findOwnersPets(parent.id)
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
          return Pet.findPet(args.id)
        }
      },
      //returns all pets
      pets: {
        type: new GraphQLList(PetType),
          resolve(parent, args){
            return Pet.findAllPets()
          }
      },
      //returns one owner
      owner: {
        type: OwnerType,
        args: {id: {type: GraphQLID}},
        resolve(parent, args){
          return Owner.findOwner(args.id)
        }
      },
      //returns all owners
      owners: {
        type: GraphQLList(OwnerType),
        resolve(parent, args){
          return Owner.findAllOwners()
        }
      }
    }
});

//export schema so index.js can access it
module.exports = new GraphQLSchema({
    query: RootQuery
});