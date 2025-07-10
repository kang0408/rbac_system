module.exports = {
  friendlyName: "Delete permission",

  description: "",

  inputs: {
    id: { type: "string" },
  },

  exits: {
    notFound: {
      description: "Permission not found",
      responseType: "notFound",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const existed = await Permission.findOne({ id: inputs.id });
      if (!existed)
        return exits.notFound({ status: 404, message: "Permission not found" });

      await Permission.destroyOne({ id: existed.id });

      return exits.success({
        status: 200,
        message: "Delete permission successfully",
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
