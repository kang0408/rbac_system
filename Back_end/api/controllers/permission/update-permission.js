module.exports = {
  friendlyName: "Update permission",

  description: "",

  inputs: {
    id: { type: "string", required: true },
    resource: {
      type: "string",
    },
    action: {
      type: "string",
    },
  },

  exits: {
    notFound: {
      description: "Permission not found",
      responseType: "notFound",
    },
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
      const existed = await Permission.findOne({ id: inputs.id });
      if (!existed)
        return exits.notFound({
          status: 404,
          message: "Permission not found",
        });

      const updateValues = {
        resource: inputs.resource,
        action: inputs.action,
      };

      const updatedPermission = await Permission.updateOne({
        id: existed.id,
      }).set(updateValues);

      if (!updatedPermission)
        return exits.notFound({
          status: 400,
          message: "Permission can not updated",
        });

      return exits.success({
        status: 200,
        message: "Updated permission successfully",
        data: updatedPermission,
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
