/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const isLoggin = require("../api/policies/isLoggin");
const permission = require("../api/policies/permission");

module.exports.policies = {
  // AUTH
  "auth/me": [isLoggin, permission],
  // USER
  "user/*": [isLoggin, permission],
  // ROLE
  "role/*": [isLoggin, permission],
  // PERMISSION
  "permission/*": [isLoggin, permission],
};
