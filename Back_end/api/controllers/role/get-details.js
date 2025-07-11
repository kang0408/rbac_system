module.exports = {
  friendlyName: "Get details",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
      description: "The role's id",
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "Role not found",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { id } = inputs;
      const details = await Role.findOne({ id: id });

      if (!details)
        return exits.notFound({ status: 404, message: "Role not found" });

      // const permissionDetails = await Permission.find({
      //   id: { in: details.permissions },
      // });

      // const permisstionFormat = {};
      // permissionDetails.forEach((item) => {
      //   if (!permisstionFormat[item.resource])
      //     permisstionFormat[item.resource] = [
      //       {
      //         id: item.id,
      //         action: item.action,
      //       },
      //     ];
      //   else {
      //     permisstionFormat[item.resource].push({
      //       id: item.id,
      //       action: item.action,
      //     });
      //   }
      // });

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
