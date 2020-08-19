const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

class Owner {
    static findOwnersPets(id) {
        return database('owners')
            .join('pets', {'owners.id': 'pets.owner_id'}
            .where('pets.owner_id', id))
    }

    static findOwner(id) {
        return database('owners')
            .where('id', id)
            .first()
    }

    static findAllOwners(){
        return database('owners')
            .select()
    }
}

module.exports = Owner
