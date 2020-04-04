const { GraphQLInt, GraphQLObjectType, GraphQLString } = require('graphql');

/**
 * @param {string} fuzzyId
 * @returns {string}
 *        The canonical id most similar to the given `fuzzyId`.
 */
function getPerson(fuzzyId) {
  return 'ssw';
}

exports.makeType = function makeType(Person) {
  return new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      person: {
        type: Person,
        args: {
          name: {
            type: GraphQLString,
          },
          limit: {
            type: GraphQLInt,
            defaultValue: 1,
          },
        },
        resolve: getPerson,
      },
      op: {
        type: Person,
        description: 'http://www.webopedia.com/TERM/O/op_original_poster.html',
        resolve: () => getPerson('ssw'),
      },
    }),
  });
};
