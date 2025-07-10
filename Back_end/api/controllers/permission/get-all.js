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
      const permission = await Permission.find({});

      const permisstionFormat = {};
      permission.forEach((item) => {
        if (!permisstionFormat[item.resource])
          permisstionFormat[item.resource] = [
            {
              id: item.id,
              action: item.action,
            },
          ];
        else {
          permisstionFormat[item.resource].push({
            id: item.id,
            action: item.action,
          });
        }
      });

      return exits.success({
        status: 200,
        message: "Get all permissions successfully",
        data: permisstionFormat,
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
