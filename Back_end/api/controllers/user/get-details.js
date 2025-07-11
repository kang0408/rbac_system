module.exports = {
  friendlyName: "Get details",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
      description: "The user's id",
    },
  },

  exits: {
    notFound: {
      responseType: "notFound",
      description: "User not found",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { id } = inputs;
      const details = await User.findOne({ id: id });
      if (!details)
        return exits.notFound({ status: 404, message: "User not found" });

      delete details.password;

      const role = await Role.findOne({ id: details.roles[0] });

      details.roles = [];
      details.roles.push({
        id: role.id,
        name: role.name,
      });

      return exits.success({
        status: 200,
        message: "Get details of user successfully",
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
