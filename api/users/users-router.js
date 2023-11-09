const express = require('express');
const usersmw = require("./users-middleware");
const usersModel = require("./users-model");
const bcryptjs = require("bcryptjs");
const tokenHelper = require("../../helpers/token-helper");

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const allUsers = await usersModel.get();
        res.json(allUsers);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', usersmw.validateUserId, (req, res, next) => {
    try {
        res.json(req.currentUser);
    } catch (error) {
        next(error);
    }
});

router.post('/', usersmw.validateUser, usersmw.validateUnique, usersmw.validateRole, async (req, res, next) => {
    try {
        const hashedPassword = bcryptjs.hashSync(req.body.password);
        const insertedUser = await usersModel.insert({ name: req.body.name, surname: req.body.surname, username: req.body.username, password: hashedPassword, email: req.body.email, mobile_phone: req.body.mobile_phone, address: req.body.address, role_name: req.body.role_name });
        res.status(201).json(insertedUser);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', usersmw.validateUserId, usersmw.validateRole, async (req, res, next) => {
    try {
        const hashedPassword = bcryptjs.hashSync(req.body.password);
        const updatedUser = await usersModel.update(req.params.id, { name: req.body.name, surname: req.body.surname, username: req.body.username, password: hashedPassword, address: req.body.address });
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', usersmw.validateUserId, async (req, res, next) => {
    try {
        await usersModel.remove(req.params.id);
        res.json(req.currentUser);
    } catch (error) {
        next(error);
    }
});

router.post('/login', usersmw.validateUserLogin, usersmw.validateLogin, (req, res, next) => {
    try {
        const tokenPayload = {
            userId: req.currentUser.user_id,
            username: req.currentUser.username,
            role_name: req.currentUser.role_name
        }
        const token = tokenHelper.generateToken(tokenPayload);
        res.json({
            message: `hoş geldiniz ${req.currentUser.username}:)`,
            token: token
        });
    } catch (error) {
        next(error);
    }
});

router.get('/limited/allUsers', usersmw.limited, (req, res, next) => {
    usersModel.get()
        .then(users => {
            res.json(users);
        })
        .catch(next);
});

router.post('/logout', usersmw.limited, (req, res, next) => {
    try {
        tokenHelper.logout(req.headers.authorization);
        res.json({ message: "çıkış işlemi başarılı!" })
    } catch (error) {
        next(error);
    }
});

router.get('/secret/:id', usersmw.limited, usersmw.only('yonetici'), (req, res, next) => {
    usersModel.getById(req.params.id)
        .then(user => {
            res.json(user);
        })
        .catch(next);
});

module.exports = router;
