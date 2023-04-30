import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from 'express-validator';
import { registerValidation } from '../validations/auth.js';

const app = express();

app.use(express.json());

mongoose
    .connect('mongodb://localhost:27017/ReactSimpleBlog')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/auth/register", registerValidation, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    res.json({
        success: true,
    });
});

/** Запуск сервера */
app.listen(5000, (err) => {
    if (err) {
        console.log("Error", err);
    }

    console.log("Server OK");
});