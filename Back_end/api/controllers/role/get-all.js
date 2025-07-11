module.exports = {
  friendlyName: "Get all",

  description: "",

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

      const formatedRoles = roles.map((item) => {
        delete item.permissions;
        return item;
      });

      return exits.success({
        status: 200,
        message: "Get all roles successfully",
        data: formatedRoles || [],
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
