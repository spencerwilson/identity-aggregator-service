
/**
 * @param {string} localId
 *        An id from a provider.
 * @returns {string}
 *        The id of the Person to which `localId` refers.
 */
function canonicalId(localId) {
  const idMap = getIdMap();
  return Object.keys(idMap).find((id) => idMap[id].includes(localId));
}

module.exports = {
  canonicalId,
  samples: {
    Basic: require('./fake'),
    //Slack: require('./slack'),
  },
};

