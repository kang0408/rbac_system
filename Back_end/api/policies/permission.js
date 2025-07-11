// api/policies/permission.js
module.exports = async function (req, res, proceed) {
  const { roles } = req.user;
  if (!req.options.options) return proceed();
  const resource = req.options.options.resource;
  const action = req.options.options.action;

  try {
    if (!roles || roles.length === 0) {
      return res.status(403).json({ message: "No roles assigned" });
    }

    const role = await Role.findOne({ id: roles[0] });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const permissions = await Permission.find({
      id: { in: role.permissions },
    });

    const isAllowed = permissions.some(
      (p) =>
        p.resource === resource &&
        (p.action === action || p.action === "manage")
    );

    if (!isAllowed) {
      return res.status(403).json({ message: "Permission denied" });
    }

    return proceed();
  } catch (error) {
    sails.log.error("Permission check failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
