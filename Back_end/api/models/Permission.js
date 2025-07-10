/**
 * Permission.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "permissions",
  attributes: {
    resource: {
      type: "string",
      required: true,
    },
    action: {
      type: "string",
      required: true,
    },
  },
};
