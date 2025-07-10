module.exports = {
  friendlyName: "Delete user",

  description: "",

  inputs: {
    id: { type: "string" },
  },

  exits: {
    notFound: {
      description: "User not found",
      responseType: "notFound",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const existed = await User.findOne({ id: inputs.id });
      if (!existed)
        return exits.notFound({ status: 404, message: "User not found" });

      await User.destroyOne({ id: existed.id });

      return exits.success({
        status: 200,
        message: "Delete user successfully",
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
