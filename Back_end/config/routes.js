/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const PREFIX = "/api/v1";
const USER_PREFIX = "/users";
const ROLE_PREFIX = "/roles";
const PERMISSION_PREFIX = "/permissions";
const AUTH_PREFIX = "/auth";

const routes = [
  // USER
  {
    method: "GET",
    path: PREFIX + USER_PREFIX,
    action: "user/get-all",
  },
  {
    method: "GET",
    path: PREFIX + USER_PREFIX + "/:id",
    action: "user/get-details",
  },
  {
    method: "PATCH",
    path: PREFIX + USER_PREFIX + "/update/:id",
    action: "user/update-user",
  },
  {
    method: "POST",
    path: PREFIX + USER_PREFIX + "/create",
    action: "user/create-user",
  },
  {
    method: "DELETE",
    path: PREFIX + USER_PREFIX + "/delete/:id",
    action: "user/delete-user",
  },
  // ROLE
  {
    method: "GET",
    path: PREFIX + ROLE_PREFIX,
    action: "role/get-all",
  },
  {
    method: "GET",
    path: PREFIX + ROLE_PREFIX + "/:id",
    action: "role/get-details",
  },
  {
    method: "PATCH",
    path: PREFIX + ROLE_PREFIX + "/update/:id",
    action: "role/update-role",
  },
  {
    method: "POST",
    path: PREFIX + ROLE_PREFIX + "/create",
    action: "role/create-role",
  },
  {
    method: "DELETE",
    path: PREFIX + ROLE_PREFIX + "/delete/:id",
    action: "role/delete-role",
  },
  // ROLE
  {
    method: "GET",
    path: PREFIX + PERMISSION_PREFIX,
    action: "permission/get-all",
  },
  {
    method: "GET",
    path: PREFIX + PERMISSION_PREFIX + "/:id",
    action: "permission/get-details",
  },
  {
    method: "PATCH",
    path: PREFIX + PERMISSION_PREFIX + "/update/:id",
    action: "permission/update-permission",
  },
  {
    method: "POST",
    path: PREFIX + PERMISSION_PREFIX + "/create",
    action: "permission/create-permission",
  },
  {
    method: "DELETE",
    path: PREFIX + PERMISSION_PREFIX + "/delete/:id",
    action: "permission/delete-permission",
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
  },
];

const routesObj = {};
routes.forEach((item) => {
  routesObj[`${item.method} ${item.path}`] = { action: item.action };
});

module.exports.routes = routesObj;
