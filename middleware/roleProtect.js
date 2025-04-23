const roleProtect = (...allowedRoles) => {
    return (req, res, next) => {
      // If the user's role is not in the allowedRoles array, deny access
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: "You don't have permission to access this resource" });
      }
      next();
    };
  };
  
  module.exports = roleProtect;
  