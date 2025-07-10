/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "users",
  attributes: {
    name: {
      type: "string",
    },
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    roles: {
      type: "json",
      columnType: "array",
      required: true,
    },
    status: {
      type: "string",
      isIn: ["active", "inactive", "banned"],
      defaultsTo: "inactive",
    },
  },
};
