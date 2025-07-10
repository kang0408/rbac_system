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
];

const routesObj = {};
routes.forEach((item) => {
  routesObj[`${item.method} ${item.path}`] = { action: item.action };
});

module.exports.routes = routesObj;
