const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Login",

  description: "Login auth.",

  inputs: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },

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
      const { email, password } = inputs;
      const existed = await User.findOne({ email: email });
      if (!existed)
        return exits.notFound({
          status: 404,
          message: "User not found",
        });

      const isMatched = await bcrypt.compare(password, existed.password);
      if (!isMatched)
        return exits.badRequest({
          status: 400,
          message: "Password is not correct",
        });

      const role = await Role.findOne({ id: existed.roles[0] });

      existed.roles = [];
      existed.roles.push({
        id: role.id,
        name: role.name,
      });

      const accessToken = jwt.sign(
        {
          username: existed.username,
          email: existed.email,
          role: existed.role,
        },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "3d",
        }
      );

      const refreshToken = jwt.sign(
        {
          username: existed.username,
          email: existed.email,
          role: existed.role,
        },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "7d",
        }
      );

      delete existed.password;

      return exits.success({
        status: 200,
        message: "Login successfully",
        data: {
          accessToken,
          refreshToken,
          user: existed,
        },
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
