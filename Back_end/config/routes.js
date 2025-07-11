/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const permission = require("../api/policies/permission");

const PREFIX = "/api/v1";
const USER_PREFIX = "/users";
const ROLE_PREFIX = "/roles";
const PERMISSION_PREFIX = "/permissions";
const AUTH_PREFIX = "/auth";
const STATISTICS_PREFIX = "/statistics";

const routes = [
  // USER
  {
    method: "GET",
    path: PREFIX + USER_PREFIX,
    action: "user/get-all",
    options: {
      resource: "user",
      action: "read",
    },
  },
  {
    method: "GET",
    path: PREFIX + USER_PREFIX + "/:id",
    action: "user/get-details",
    options: {
      resource: "user",
      action: "read",
    },
  },
  {
    method: "PATCH",
    path: PREFIX + USER_PREFIX + "/update/:id",
    action: "user/update-user",
    options: {
      resource: "user",
      action: "update",
    },
  },
  {
    method: "POST",
    path: PREFIX + USER_PREFIX + "/create",
    action: "user/create-user",
    options: {
      resource: "user",
      action: "create",
    },
  },
  {
    method: "DELETE",
    path: PREFIX + USER_PREFIX + "/delete/:id",
    action: "user/delete-user",
    options: {
      resource: "user",
      action: "update",
    },
  },
  // ROLE
  {
    method: "GET",
    path: PREFIX + ROLE_PREFIX,
    action: "role/get-all",
    options: {
      resource: "role",
      action: "read",
    },
  },
  {
    method: "GET",
    path: PREFIX + ROLE_PREFIX + "/:id",
    action: "role/get-details",
    options: {
      resource: "role",
      action: "read",
    },
  },
  {
    method: "PATCH",
    path: PREFIX + ROLE_PREFIX + "/update/:id",
    action: "role/update-role",
    options: {
      resource: "role",
      action: "update",
    },
  },
  {
    method: "POST",
    path: PREFIX + ROLE_PREFIX + "/create",
    action: "role/create-role",
    options: {
      resource: "role",
      action: "create",
    },
  },
  {
    method: "DELETE",
    path: PREFIX + ROLE_PREFIX + "/delete/:id",
    action: "role/delete-role",
    options: {
      resource: "role",
      action: "delete",
    },
  },
  // PERMISSION
  {
    method: "GET",
    path: PREFIX + PERMISSION_PREFIX,
    action: "permission/get-all",
    options: {
      resource: "permission",
      action: "read",
    },
  },
  {
    method: "GET",
    path: PREFIX + PERMISSION_PREFIX + "/:id",
    action: "permission/get-details",
    options: {
      resource: "permission",
      action: "read",
    },
  },
  {
    method: "PATCH",
    path: PREFIX + PERMISSION_PREFIX + "/update/:id",
    action: "permission/update-permission",
    options: {
      resource: "permission",
      action: "update",
    },
  },
  {
    method: "POST",
    path: PREFIX + PERMISSION_PREFIX + "/create",
    action: "permission/create-permission",
    options: {
      resource: "permission",
      action: "create",
    },
  },
  {
    method: "DELETE",
    path: PREFIX + PERMISSION_PREFIX + "/delete/:id",
    action: "permission/delete-permission",
    options: {
      resource: "permission",
      action: "delete",
    },
  },
  // AUTH
  {
    method: "POST",
    path: PREFIX + AUTH_PREFIX + "/login",
    action: "auth/login",
  },
  {
    method: "GET",
    path: PREFIX + AUTH_PREFIX + "/me",
    action: "auth/me",
    options: {
      resource: "product",
      action: "read",
    },
  },
  // STATISTICS
  {
    method: "GET",
    path: PREFIX + STATISTICS_PREFIX,
    action: "statistics/total",
  },
];

const routesObj = {};
routes.forEach((item) => {
  routesObj[`${item.method} ${item.path}`] = {
    action: item.action,
    ...(item.policy && { policy: item.policy }),
    ...(item.options && { options: item.options }),
  };
});

module.exports.routes = routesObj;
