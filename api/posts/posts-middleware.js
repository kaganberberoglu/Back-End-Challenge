require("dotenv").config();
const postsModel = require("./posts-model");

function logger(req, res, next) {
    let timestamp = new Date().toLocaleString();
    let url = req.originalUrl;
    let method = req.method;

    console.log(`${timestamp} -- ${method} -- ${url}`);

    next();
};

async function validatePostId(req, res, next) {
    try {
        const post = await postsModel.getById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "post bulunamadı!" });
        } else {
            req.currentPost = post;
            next();
        }
    } catch (error) {
        next(error);
    }
};

function validatePostAndUsername(req, res, next) {
    try {
        let { post, username } = req.body;
        if (!post || !username || post.length > 280) {
            res.status(400).json({ message: "bütün boş alanlar uygun post (maksimum 280 karakter) ve kullanıcı adı ile doldurulmalıdır!" });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
};

function validatePost(req, res, next) {
    try {
        let { post } = req.body;
        if (!post || post.length > 280) {
            res.status(400).json({ message: "boş alan uygun post (maksimum 280 karakter) ile doldurulmalıdır!" });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    logger,
    validatePostId,
    validatePostAndUsername,
    validatePost
};
