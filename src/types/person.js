const { GraphQLList, GraphQLObjectType } = require('graphql');

const Providers = require('../providers');
const TypeStore = require('../type_store');

/**
 * The Person type present in built schemas.
 */
exports.makeType = function makePerson(providers) {
  return new GraphQLObjectType({
    name: 'Person',
    fields: aggregateFields(providers),
  });
};

/**
 * Wire up all the fields from all the providers!
 * @param {Array.<Provider>} providers
 *        Providers whose fields to include in the returned result.
 *        Sorted in descending precedence order (i.e., [primarySource, secondarySource, ...]).
 * @returns {GraphQLFieldConfigMap}
 *        A single set of fields comprised of all fields of the given providers
 *        coalesced into a single config map, with resolvers augmented to handle
 *        Person references.
 */
function aggregateFields(providers) {
  // Map providerId -> GraphQLFieldConfigMap
  let providerFields = providers.reduce((acc, p) => {
    acc[p.id] = p.definePerson(TypeStore.PersonStub, TypeStore.PersonListStub);
    return acc;
  }, {});

  // Haven't yet coalesced anything, but doing so erases the link between providerId
  // and field, which is information needed to properly wrap the resolver.
  // Therefore, wrap all resolvers before merging, despite some of those resolvers
  // being discarded during the subsequent merge.
  // 
  // TODO: Possible optimization: Dedupe before this step, then merge after
  // to avoid excessive work.
  // @type Array.<GraphQLFieldConfigMap>
  providerFields = Object.entries(providerFields).map(([providerId, fieldMap]) => {
    return wrapResolvers(providerId, fieldMap);
  });

  const merged = Object.assign({}, ...providerFields);

  // stubs still present! gotta pull out the stubs and thunkify this shit
  return destub(merged);
}

/**
 * @param {GraphQLFieldConfigMap} fieldMap
 * @returns {GraphQLFieldConfigMapThunk}
 *        The given fieldMap, but turning into a thunk and with stubs
 *        replaced with real instances lazily loaded from `Types.store`.
 *        Mutates the GraphQLFieldConfigs.
 */
function destub(fieldMap) {
  return () => {
    const Person = TypeStore.store.get(TypeStore.PersonStub);
    const PersonList = new GraphQLList(Person);

    return Object.entries(fieldMap).reduce((acc, [fieldName, config]) => {
      if (config.type === TypeStore.PersonStub) {
        config.type = Person;
      }
      else if (config.type === TypeStore.PersonListStub) {
        config.type = PersonList;
      }

      acc[fieldName] = config;
      return acc;
    }, {});
  };
}

/**
 * @param {string} providerId
 * @param {GraphQLFieldConfigMap} fieldMap
 *        Person definition from the provider whose id is `providerId`.
 * @returns {GraphQLFieldConfigMap}
 *        A new map with shallow copies of the given GraphQLFieldConfigs, but with the
 *        fields' resolvers replaced with versions that are suitable for attachment to
 *        the Person type.
 */
function wrapResolvers(providerId, fieldMap) {
  return Object.entries(fieldMap).reduce((acc, [fieldName, config]) => {
    acc[fieldName] = Object.assign({}, config);
    acc[fieldName].resolver = wrapResolver(providerId, fieldName, config);
    return acc;
  }, {});
}

/**
 * @param {string} providerId
 * @param {string} fieldName
 * @param {GraphQLFieldConfig} config
 * @returns {GraphQLFieldResolveFn}
 *        A resolver capable of receiving Person canonical ids as the `source`
 *        and returning 
 *          - in the case of scalar fields: a scalar from the given provider, or 
 *          - in the case of Person-based fields: the canonical id(s) for other Persons.
 */
function wrapResolver(providerId, fieldName, config) {
  return function wrappedResolver(id) {
    const localId = getLocalId(providerId, id);
    const localPerson = getPersonResolver(providerId)(localId);

    const localResolver = getResolver(fieldName, config);

    if (config.type === TypeStore.PersonStub) {
      const localId = localResolver(localPerson);
      return Providers.canonicalId(localId);
    }
    else if (config.type === TypeStore.PersonListStub) {
      const localIds = localResolver(localPerson);
      return localIds.map(Providers.canonicalId);
    }
    else {
      return localResolver(localPerson);
    }
  };
}

/**
 * @param {string} fieldName
 * @param {GraphQLFieldConfig} config
 * @returns {GraphQLFieldResolveFn}
 *        The defined resolver (if one exists), else the default resolver.
 */
function getResolver(fieldName, config) {
  return config.resolver || ((source) => source[fieldName]);
}
