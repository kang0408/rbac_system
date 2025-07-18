/**
 * Role.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "roles",
  attributes: {
    name: {
      type: "string",
      required: true,
    },
    permissions: {
      type: "json",
      columnType: "array",
    },
  },
};
