module.exports = {
  friendlyName: "Update role",

  description: "",

  inputs: {
    id: { type: "string", required: true },
    name: {
      type: "string",
    },
    permissions: {
      type: "json",
      columnType: "array",
    },
  },

  exits: {
    notFound: {
      description: "Role not found",
      responseType: "notFound",
    },
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
      const existed = await Role.findOne({ id: inputs.id });
      if (!existed)
        return exits.notFound({
          status: 404,
          message: "Role not found",
        });

      const updateValues = {
        name: inputs.name,
        permissions: inputs.permissions
          ? [...inputs.permissions]
          : existed.permissions,
      };

      const updatedRole = await Role.updateOne({ id: existed.id }).set(
        updateValues
      );

      if (!updatedRole)
        return exits.notFound({
          status: 400,
          message: "Role can not updated",
        });

      return exits.success({
        status: 200,
        message: "Updated role successfully",
        data: updatedRole,
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
