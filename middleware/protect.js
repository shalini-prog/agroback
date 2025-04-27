const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies["jwt-page"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    req.user = { userId: decoded.id, role: decoded.role };

    console.log("✅ The decoded user is:", req.user);
    console.log("🍪 Incoming cookies:", req.cookies);

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Unauthorized - Token Verification Failed" });
  }
};

module.exports = protect;
