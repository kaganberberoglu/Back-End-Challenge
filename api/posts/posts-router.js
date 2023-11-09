const express = require('express');
const postsmw = require("./posts-middleware");
const postsModel = require("./posts-model");

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const allPosts = await postsModel.get();
        res.json(allPosts);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', postsmw.validatePostId, (req, res, next) => {
    try {
        res.json(req.currentPost);
    } catch (error) {
        next(error);
    }
});

router.post('/', postsmw.validatePostAndUsername, async (req, res, next) => {
    try {
        const insertedPost = await postsModel.insert({ post: req.body.post, username: req.body.username });
        res.status(201).json(insertedPost);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', postsmw.validatePostId, postsmw.validatePost, async (req, res, next) => {
    try {
        const updatedUser = await postsModel.update(req.params.id, { post: req.body.post });
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', postsmw.validatePostId, async (req, res, next) => {
    try {
        await postsModel.remove(req.params.id);
        res.json(req.currentPost);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
