/**
 * Helper function to update item names to upper case for consistent UI.
 * @param array the array of items to be updated.
 * @returns {Array} updated array with item names change to uppercase.
 */
exports.updateNameToUpperCase = (array) => {
  return array.map((item) => {
    return { ...item, name: item.name.toUpperCase() };
  });
};
