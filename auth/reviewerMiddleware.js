const jwt = require("jsonwebtoken");
const config = require("../config");
const { db } = require("../firebase");
// const User = require("../model/user");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      res.json({ message: "Authentication failed", status: false });
    } else {
      const decode = jwt.verify(token, config.JWT_TOKEN_KEY, null);
      req.data = decode;
      const user = await db.collection("reviewer").doc(req.data.id).get();
      if (!user.exists) {
        next();
      } else {
        if (user.blocked === true) {
          res.json({ message: "User Blocked", status: true, blocked: true });
        } else {
          next();
        }
      }
    }
  } catch (error) {
    res.json({ message: "Authentication failed", status: false });
  }
};

module.exports = authentication;
