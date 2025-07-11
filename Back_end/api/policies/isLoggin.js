const jwt = require("jsonwebtoken");

module.exports = async function (req, res, proceed) {
  try {
    const token = req.headers.authorization;
    if (!token)
      return res.status(401).json({
        status: 401,
        message: "Access denied. Please login or register account",
      });

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      return res.status(401).json({
        status: 401,
        message: "Invalid token format",
      });

    const tokenValue = tokenParts[1];
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET || "");

    const user = await User.findOne({ email: decoded.email });
    if (!user)
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });

    delete user.password;

    req.user = user;
    return proceed();
  } catch (error) {
    sails.log.error("Server Error: ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
