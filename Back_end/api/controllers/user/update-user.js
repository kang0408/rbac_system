module.exports = {
  friendlyName: "Update user",

  description: "",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    roles: {
      type: "json",
      columnType: "array",
    },
    status: {
      type: "string",
      isIn: ["active", "inactive", "banned"],
      defaultsTo: "inactive",
    },
  },

  exits: {
    notFound: {
      description: "User not found",
      responseType: "notFound",
    },
    badRequest: {
      responseType: "badRequest",
      description: "Create user failed",
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
        return exits.notFound({
          status: 404,
          message: "User not found",
        });

      if (existed.email) {
        const isMatch = await User.find({ email: existed.email });
        if (isMatch.length > 1) {
          return exits.badRequest({
            status: 400,
            message: "Email is existed",
          });
        }
      }

      const updateValues = {
        name: inputs.name,
        email: inputs.email,
        roles: inputs.roles ? [...inputs.roles] : existed.roles,
        status: inputs.status,
      };

      const updatedUser = await User.updateOne({ id: existed.id }).set(
        updateValues
      );

      if (!updatedUser)
        return exits.notFound({
          status: 400,
          message: "User can not updated",
        });

      delete updatedUser.password;

      return exits.success({
        status: 200,
        message: "Updated user successfully",
        data: updatedUser,
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
