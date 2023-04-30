import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from 'express-validator';
import { registerValidation } from '../validations/auth.js';
import UserModel from "../entities/User/model/UserModel.js";

const app = express();

app.use(express.json());

mongoose
    .connect('mongodb://localhost:27017/ReactSimpleBlog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
    
        const user = await doc.save();
        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        const { passwordHash, ...userData} = user._doc;

        res.json({ userData, token });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
});

/** Запуск сервера */
app.listen(5000, (err) => {
    if (err) {
        console.log("Error", err);
    }

    console.log("Server OK");
});