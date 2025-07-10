module.exports = {
  friendlyName: "Create permission",

  description: "",

  inputs: {
    resource: {
      type: "string",
      required: true,
    },
    action: {
      type: "string",
    },
  },

  exits: {
    badRequest: {
      responseType: "badRequest",
      description: "Create permission failed",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const newPer = await Permission.create(inputs).fetch();

      if (!newPer)
        return exits.badRequest({
          status: 400,
          message: "Create new permission failed",
        });

      return exits.success({
        status: 200,
        message: "Create new permission successfully",
        data: newPer,
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
