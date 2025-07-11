module.exports = {
  friendlyName: "Total",

  description: "Total statistics.",

  inputs: {},

  exits: {
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const users = await User.find();
      const roles = await Role.find();
      const permissions = await Permission.find();

      return exits.success({
        status: 200,
        message: "Get all roles successfully",
        data: [
          {
            name: "user",
            title: "Total Users",
            value: users.length,
            description: "Active users in system",
          },
          {
            name: "role",
            title: "Roles",
            value: roles.length,
            description: "Different user roles",
          },
          {
            name: "permission",
            title: "Permissions",
            value: permissions.length,
            description: "System permissions",
          },
        ],
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
