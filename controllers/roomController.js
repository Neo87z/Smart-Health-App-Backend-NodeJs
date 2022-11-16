const express = require('express');
const router = express.Router();
var _ = require("underscore");
const bcrypt = require('bcrypt');
let Room = require('../models/room')
let User = require('../models/messageData')
let Bet = require('../models/betdata');
const { forEach } = require('underscore');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken')

const Messages = []

Acess_KEY = "$2b$10$BD90Kkg4axivQpJAP1FDiOApkdqLtZ8j4q93qQOFATu/voN1ZGsd"

API_KEY = 's'

const multer = require('multer');

module.exports = function () {




    const verifyJWT = (req, res, next) => {
        const token = req.headers["x-access-token"]
        const API_KEY = req.headers["x-dsi-api-key"]

        console.log(Acess_KEY)
        console.log(API_KEY, 'lol')
        console.log(token)

        if (!token) {
            res.json({
                auth: false,
                Login: false,
                Message: "Authenication 1Failed"
            });
        } else {
            jwt.verify(token, "jwtSecret", (err, decoded) => {
                if (err) {
                    res.json({
                        auth: false,
                        Login: false,
                        Message: "Authenication Failed"
                    });
                } else {
                    req.userID = decoded.id;
                    next();

                }
            })

        }



    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    });
    const upload = multer({ storage }).array('file');
    router.post('/upload', (req, res) => {
        console.log(req.body.files)
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json(err)
            }


            return res.status(200).send(req.files)
        })
    });

    //Imlashi
    router.post('/login', function (req, res) {
        console.log(req.body.EmpoyeeID)
        console.log(req.body.Password)
        if (req.body.EmpoyeeID == '112') {
            if (req.body.Password == 'abc') {

                const ID = parseInt(req.body.EmpoyeeID)
                const token = jwt.sign({ ID }, "jwtSecret", {
                    expiresIn: 300,
                })
                res.json({
                    Login: true,
                    token: token,
                    Type: "Manager",
                    Message: "User Logged In"
                });
            } else {
                res.json({
                    Login: false,
                    Message: "Login Fail"
                });
            }
        } else {
            if (req.body.EmpoyeeID == '900') {
                if (req.body.Password == 'abc') {
                    const ID = parseInt(req.body.EmpoyeeID)
                    const token = jwt.sign({ ID }, "jwtSecret", {
                        expiresIn: 300,
                    })
                    res.json({
                        Login: true,
                        token: token,
                        Type: "Worker",
                        Message: "User Logged In"
                    });

                } else {
                    res.json({
                        Login: false,
                        Message: "Login Fail"
                    });

                }

            } else {
                res.json({
                    Login: false,
                    Message: "Login Fail"
                });
            }

        }


    })



    router.get('/Authenicate', verifyJWT, function (req, res) {


        res.json({
            Login: true,
            auth: true,
            Message: "User Authenicated"
        });

    })

    router.post('/SaveMessages', function (req, res) {

        console.log(req.body.Message)
        Messages.push(req.body.Message)

        res.json({

            Message: "Message Saved"
        });

    })

    router.get('/GetSavedMessages', verifyJWT, function (req, res) {


        res.json({

            Message: Messages
        });

    })



    return router;
}