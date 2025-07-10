module.exports = {
  friendlyName: "Get details",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
      description: "The permission's id",
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Permission not found",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { id } = inputs;
      const details = await Permission.findOne({ id: id });

      if (!details)
        return exits.notFound({ status: 404, message: "Permission not found" });

      return exits.success({
        status: 200,
        message: "Get details of role successfully",
        data: details,
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
