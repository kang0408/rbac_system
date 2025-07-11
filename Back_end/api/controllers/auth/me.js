module.exports = {
  friendlyName: "Me",

  description: "Me auth.",

  inputs: {},

  exits: {
    notFound: {
      responseType: "notFound",
      description: "User not found",
    },
    badRequest: {
      responseType: "badRequest",
      description: "Login failed",
    },
    serverError: {
      responseType: "serverError",
      description: "Something went wrong on the server.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { id } = this.req.user;

      const user = await User.findOne({ id });

      if (!user) {
        return exits.notFound({
          status: 404,
          message: "User not found",
        });
      }

      delete user.password;

      return exits.success({
        status: 200,
        message: "Get profile successfully",
        data: user,
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
