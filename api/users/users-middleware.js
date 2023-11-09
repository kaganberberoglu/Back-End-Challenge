require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "shh";
const jwt = require("jsonwebtoken");
const usersModel = require("./users-model");
const bcryptjs = require("bcryptjs");
const tokenHelper = require("../../helpers/token-helper");

function logger(req, res, next) {
    let timestamp = new Date().toLocaleString();
    let url = req.originalUrl;
    let method = req.method;

    console.log(`${timestamp} -- ${method} -- ${url}`);

    next();
};

async function validateUserId(req, res, next) {
    try {
        const user = await usersModel.getById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "kullanıcı bulunamadı!" });
        } else {
            req.currentUser = user;
            next();
        }
    } catch (error) {
        next(error);
    }
};

function validateUser(req, res, next) {
    try {
        let { name, surname, username, password, email, mobile_phone, address } = req.body;
        if (!name || !surname || !username || !password || !email || !mobile_phone || !address || username.length > 255 || password.length > 255) {
            res.status(400).json({ message: "bütün boş alanlar uygun kullanıcı adı ve şifre uzunlukları ile doldurulmalıdır!" });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
};

function validateRole(req, res, next) {
    try {
        let { role_name } = req.body;
        if (!role_name) {
            req.body.role_name = "misafir";
            next();
        } else {
            role_name = role_name.trim();
            if (role_name.length > 32) {
                res.status(422).json({ message: "rol adı 32 karakterden fazla olamaz!" });
            } else if (role_name === "yonetici") {
                res.status(422).json({ message: "rol adı yonetici olamaz!" });
            } else {
                req.body.role_name = role_name;
                next();
            }
        }
    } catch (error) {
        next(error);
    }
};

async function validateUnique(req, res, next) {
    try {
        const usernameExist = await usersModel.getByUsername(req.body.username);
        const emailExist = await usersModel.getByEmail(req.body.email);
        const mobilePhoneExist = await usersModel.getByMobilePhone(req.body.mobile_phone);
        if (usernameExist || emailExist || mobilePhoneExist) {
            res.status(400).json({ message: "aynı kullanıcı adı, email veya cep telefonu numarası ile daha önceden kayıt oluşturulmuş!" });
        } else {
            next();
        }
    } catch (error) {
        next(error)
    }
};

function validateUserLogin(req, res, next) {
    try {
        let { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "bütün boş alanlar doldurulmalıdır!" });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
};

async function validateLogin(req, res, next) {
    try {
        const user = await usersModel.getByUsername(req.body.username);
        if (!user) {
            res.status(400).json({ message: "giriş bilgilerinizde hata var!" });
        } else {
            const passwordIsTrue = bcryptjs.compareSync(req.body.password, user.password);
            if (passwordIsTrue) {
                req.currentUser = user;
                next();
            } else {
                res.status(400).json({ message: "hatalı şifre girişi yaptınız!" });
            }
        }
    } catch (error) {
        next(error);
    }
};

async function limited(req, res, next) {
    try {
        let token = req.headers["authorization"];
        if (!token) {
            res.status(401).json({ message: "token gereklidir!" });
        } else {
            jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    await tokenHelper.deleteFromBlackListToken(token);
                    res.status(401).json({ message: "token geçersizdir!" });
                } else {
                    const isLogoutBefore = await tokenHelper.checkBlackListToken(token);
                    if (isLogoutBefore) {
                        res.status(400).json({ message: "daha önce çıkış yapılmış, tekrar giriş yapınız!" })
                    } else {
                        req.decodedToken = decodedToken;
                        next();
                    }
                }
            })
        }
    } catch (error) {
        next(error);
    }
};

const only = role_name => (req, res, next) => {
    try {
        if (req.decodedToken.role_name === role_name) {
            next();
        } else {
            res.status(403).json({ message: "bu işlem için yetkiniz bulunmamaktadır!" });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    logger,
    validateUserId,
    validateUser,
    validateUserLogin,
    validateUnique,
    validateLogin,
    limited,
    validateRole,
    only
};
