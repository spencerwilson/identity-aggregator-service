const { GraphQLSchema } = require('graphql');

const Providers = require('./providers');
const Types = require('./types');
const TypeStore = require('./type_store');

function createSchema({ providers }) {
  const Person = Types.Person.makeType(providers);

  // Store for later retrieval within the FieldConfigMapThunk.
  TypeStore.store.set(TypeStore.PersonStub, Person);

  const Query = Types.Query.makeType(Person);

  return new GraphQLSchema({ query: Query });
}

module.exports = {
  createSchema,
  sampleProviders: Providers.samples,
};

