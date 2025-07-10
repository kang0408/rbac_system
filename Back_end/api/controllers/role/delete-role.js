module.exports = {
  friendlyName: "Delete role",

  description: "",

  inputs: {
    id: { type: "string" },
  },

  exits: {
    notFound: {
      description: "Role not found",
      responseType: "notFound",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const existed = await Role.findOne({ id: inputs.id });
      if (!existed)
        return exits.notFound({ status: 404, message: "Role not found" });

      await Role.destroyOne({ id: existed.id });

      return exits.success({
        status: 200,
        message: "Delete role successfully",
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
