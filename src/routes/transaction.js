const axios = require("axios");
const express = require("express");
const transactionRouter = express.Router();

const mysqlConnection = require("../configs/db.config");

transactionRouter.get("/api/transactions", (req, res, next) => {
    mysqlConnection.query("SELECT * FROM transactions", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
            next();
        }
    });
});

transactionRouter.get("/api/transaction", (req, res) => {
    const id = req.query.id;

    mysqlConnection.query(
        "SELECT * FROM transactions WHERE idTransaction = ?",
        [id],
        (err, rows, fields) => {
            if (!err) {
                res.send(rows[0]);
            } else {
                console.log(err);
                res.send("Transaction not found");
            }
        }
    );
});

transactionRouter.get("/api/transaction/originate", (req, res) => {
    const id = req.query.id;
    mysqlConnection.query(
        "SELECT * FROM transactions WHERE originalAddressBankAccount = ?",
        [id],
        (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
                res.send("You have not send transactions yet");
            }
        }
    );
});

transactionRouter.get("/api/transaction/destination", (req, res) => {
    const id = req.query.id;
    mysqlConnection.query(
        "SELECT * FROM transactions WHERE destinationAddressBankAccount = ?",
        [id],
        (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
                res.send("You have not recive transactions yet");
            }
        }
    );
});
function generateTransactionId() {
    let number = Math.floor(Math.random() * 100000000000000);
    return String(number);
}

transactionRouter.post("/api/transaction", (req, res, next) => {
    const {
        originalAddressBankAccount,
        destinationAddressBankAccount,
        amount,
        reason,
        generalBalance,
    } = req.body;

    let time = new Date();
    let month = time.getMonth() + 1;
    let nowDate =
        time.getFullYear() +
        "-" +
        month +
        "-" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds();

    mysqlConnection.query(
        "INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?)",
        [
            generateTransactionId(),
            originalAddressBankAccount,
            destinationAddressBankAccount,
            amount,
            nowDate,
            reason,
        ],
        (err) => {
            if (!err) {
                const newBalance = generalBalance - amount;
                axios.put(
                    process.env.SERVER_ADDRESS + "/api/bankaccount",
                    {
                        balance: newBalance,
                    },
                    {
                        headers: {
                            Authorization: req.headers.authorization,
                        },
                        params: {
                            id: originalAddressBankAccount,
                        },
                    }
                );
                axios.put(
                    process.env.SERVER_ADDRESS + "/api/bankaccountdestination",
                    {
                        balance: amount,
                    },
                    {
                        headers: {
                            Authorization: req.headers.authorization,
                        },
                        params: {
                            id: destinationAddressBankAccount,
                        },
                    }
                );
                res.send("Transaction created");
            } else {
                console.log(err);
                res.send("Transaction not added");
            }
        }
    );
});

module.exports = transactionRouter;
