module.exports = {
  friendlyName: "Get all",

  description: "",

  inputs: {
    page: {
      type: "number",
      description: "The current page",
      defaultsTo: 1,
    },
    limit: {
      type: "number",
      description: "Quantity of item in a page",
      defaultsTo: 5,
    },
    search: {
      type: "string",
      description: "Search string query",
    },
    sortBy: {
      type: "string",
      description: "Sort by something, default is sorting by updated time",
      defaultsTo: "updatedAt",
    },
    sortValue: {
      type: "string",
      description: "Sort decreasing or increasing",
      isIn: ["ASC", "DESC"],
      defaultsTo: "DESC",
    },
  },

  exits: {
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { page, limit, search, sortBy, sortValue } = inputs;

      const whereOptions = {};

      if (search) {
        whereOptions.email = {
          $regex: search,
          $options: "i",
        };
      }

      const mongoClient = User.getDatastore().manager.client;

      const users = await mongoClient
        .db("rbac_system")
        .collection("users")
        .find(whereOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({
          [sortBy]: sortValue,
        })
        .project({ password: 0 })
        .toArray();

      const allRoleIds = [
        ...new Set(users.flatMap((user) => user.roles || [])),
      ];

      const roles = await Role.find({
        id: { in: allRoleIds },
      });

      const roleMap = {};
      roles.forEach((role) => {
        roleMap[role.id] = {
          id: role.id,
          name: role.name,
        };
      });

      const usersWithRoles = users.map((user) => {
        const populatedRoles = (user.roles || []).map(
          (roleId) =>
            roleMap[typeof roleId === "string" ? roleId : roleId.toString()]
        );
        return {
          ...user,
          roles: populatedRoles,
        };
      });

      const total = await mongoClient
        .db("rbac_system")
        .collection("users")
        .find(whereOptions)
        .toArray();
      const pageTotal = Math.ceil(total.length / limit);

      return exits.success({
        status: 200,
        message: "Get all users successfully",
        data: {
          users: usersWithRoles,
          total: total.length,
          page,
          limit,
          pageTotal,
        },
      });
    } catch (error) {
      sails.log.error("Server Error: ", error);
      return exits.serverError({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
};
