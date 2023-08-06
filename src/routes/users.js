const axios = require("axios");
const express = require("express");
const userRouter = express.Router();

const mysqlConnection = require("../configs/db.config");

userRouter.get("/api/users", (req, res, next) => {
    let json = JSON.stringify(req.body);
    console.log(json);
    console.log(json.length);
    mysqlConnection.query("SELECT * FROM users", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
            res.send("User not found");
        }
    });
});

userRouter.get("/api/user", (req, res, next) => {
    const id = req.query.id;
    mysqlConnection.query(
        "SELECT * FROM users WHERE uid = ?",
        [id],
        (err, rows, fields) => {
            if (!err) {
                res.send(rows[0]);
            } else {
                console.log(err);
                res.send("User not found");
            }
        }
    );
});

userRouter.get("/api/userbankname", (req, res) => {
    const id = req.query.id;
    mysqlConnection.query('SELECT name, lastname FROM users WHERE addressBankAccount = ?', [id], 
    (err, rows) => {
        if(!err){
            res.send(rows[0]);
        }
        else{
            console.log(err);
            res.status(404).send("User not found")
        }
    }
    )
})


// Generate a random number of 10 digits, this is the bank account number
function generateRandomNumber() {
    let number = Math.floor(Math.random() * 10000000000);

    return String(number);
}

userRouter.post("/api/users", (req, res, next) => {
    const { uid, name, lastname, email, idcard } = req.body;

    let addressBankAccount = [];
    addressBankAccount.push(generateRandomNumber());

    mysqlConnection.query(
        'INSERT INTO bankAccount VALUES (?, 0, "A")',
        [addressBankAccount[0]],
        (err) => {
            if (err) {
                console.log(err);
                next();
            }
        }
    );

    mysqlConnection.query(
        'INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, "A")',
        [uid, name, lastname, email, idcard, addressBankAccount[0]],
        (err, rows, fields) => {
            if (!err) {
                res.send("User added");
            } else {
                console.log(err);
                next();
            }
        }
    );
});

userRouter.put("/api/users", (req, res, next) => {
    const { uid, name, lastname, email } = req.body;

    mysqlConnection.query(
        "UPDATE users SET name = ?, lastname = ?, email = ? WHERE uid = ?",
        [name, lastname, email, uid],
        (err, rows, fields) => {
            if (!err) {
                res.send("User updated");
            } else {
                console.log(err);
                next();
            }
        }
    );
});

module.exports = userRouter;
