module.exports = {
  friendlyName: "Create role",

  description: "",

  inputs: {
    name: {
      type: "string",
      required: true,
    },
    permissions: {
      type: "json",
      columnType: "array",
    },
  },

  exits: {
    badRequest: {
      responseType: "badRequest",
      description: "Create role failed",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const newRole = await Role.create(inputs).fetch();

      if (!newRole)
        return exits.badRequest({
          status: 400,
          message: "Create new role failed",
        });

      return exits.success({
        status: 200,
        message: "Create new role successfully",
        data: newRole,
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
