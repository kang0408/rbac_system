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
      const roles = await Role.find();

      const users = await User.find();

      const permissions = await Permission.find();

      return exits.success({
        status: 200,
        message: "Get all roles successfully",
        data: {
          roles: roles.length,
          users: users.length,
          permissions: permissions.length,
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
