const { GraphQLString } = require('graphql');

module.exports = {
  // Stubs given to providers' `definePerson` functions.
  // Addresses the chicken-egg problem of a provider's fieldMap often depends
  // on Person, but those fieldMaps are needed to _construct_ Person.
  PersonStub: GraphQLString,
  PersonListStub: GraphQLString,

  // A place to store constructed instances of the above stubbed types.
  // This is useful for types that contain themselves recursively (e.g., Person)
  // so that their GraphQLFieldConfigMapThunk can pull them out of here.
  // Keys: type module objects, Values: instance of the corresponding type.
  store: new Map(),
};  
