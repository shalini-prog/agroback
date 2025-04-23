const jwt = require("jsonwebtoken")


const generateTokenAndSetCookie = (user,res) => {
    const token = jwt.sign(
        { id:user._id,role:user.role },
         process.env.JWT_SECRET,
          { expiresIn: "1h" }
    );

    res.cookie("jwt-page", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return token;
};

module.exports = generateTokenAndSetCookie;