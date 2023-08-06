const axios = require("axios");
const express = require("express");
const bankAccountRouter = express.Router();

const mysqlConnection = require("../configs/db.config");

bankAccountRouter.get("/api/bankaccount", (req, res, next) => {
    const id = req.query.id;
    mysqlConnection.query(
        "SELECT * FROM bankAccount WHERE addressBankAccount = ?",
        [id],
        (err, rows, fields) => {
            if (!err) {
                res.send(rows[0]);
            } else {
                console.log(err);
                res.send("Bank Account not found");
            }
        }
    );
});

bankAccountRouter.put("/api/bankaccount", (req, res) => {
    const {balance} = req.body;
    const id = req.query.id;
    mysqlConnection.query(
        "UPDATE bankAccount SET generalBalance = ? WHERE addressBankAccount = ?",
        [balance, id],
        (err, rows, fields) => {
            if (!err) {
                res.send('General balance updated')
            } else {
                console.log(err)
                res.send("General balance could not be updated");
            }
        }
    );
});

bankAccountRouter.put("/api/bankaccountdestination", (req, res) => {
    const {balance} = req.body;
    const id = req.query.id;
    mysqlConnection.query(
        "UPDATE bankAccount SET generalBalance = generalBalance + ? WHERE addressBankAccount = ?",
        [balance, id],
        (err, rows, fields) => {
            if (!err) {
                res.send('Destination balance updated')
            } else {
                console.log(err)
                res.send("Destination balance could not be updated");
            }
        }
    );
})

module.exports = bankAccountRouter;
