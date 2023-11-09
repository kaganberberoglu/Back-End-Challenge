require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "shh";
const jwt = require("jsonwebtoken");
const db = require("../data/db-config");

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

const logout = async function (token) {
    await db("tokenBlackList").insert({ token: token });
};

const deleteFromBlackListToken = (token) => {
    db("tokenBlackList").where("token", token).del();
};

const checkBlackListToken = (token) => {
    return db("tokenBlackList").where("token", token).first();
}

module.exports = {
    JWT_SECRET: JWT_SECRET,
    generateToken,
    logout,
    deleteFromBlackListToken,
    checkBlackListToken
};
