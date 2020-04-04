const fs = require('fs');

const {
  GraphQLID,
  GraphQLInt,
} = require('graphql');

function definePerson(Person, PersonList) {
  return {
    id: {
      type: GraphQLID,
    },
    age: {
      type: GraphQLInt
    },
    friends: {
      type: PersonList,
      resolver: function(p) {
        return p.friends;
      }
    }
  };
}

function getPerson(id) {
  return JSON.parse(fs.readFileSync('db.json'))[id];
}

module.exports = () => ({
  id: 'basic',
  definePerson,
  getPerson,
});

