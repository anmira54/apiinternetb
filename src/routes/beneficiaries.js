const express = require('express');
const beneficiariesRoute = express.Router();


const mysqlConnection = require("../configs/db.config");

beneficiariesRoute.get("/api/beneficiaries", (req, res, next) => {
    let json = JSON.stringify(req.body);

    if (json.length === 2) {

        mysqlConnection.query("SELECT * FROM beneficiaries", (err, rows, fields) => {
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
                res.status(404).send('Beneficiaries not found')
            }
        }
        );
    } else if (json.length === 35) {
        const { addressBankAccount } = req.body;

        mysqlConnection.query("SELECT * FROM beneficiaries WHERE addressBankAccount = ?", [addressBankAccount],
            (err, rows, fields) => {
                if (!err) {
                    res.send(rows)
                } else {
                    console.log(err);
                    res.status(404).send('Beneficiaries not found')
                }
            }
        )
    }
});

beneficiariesRoute.post("/api/beneficiaries", (req, res, next) => {
    const { addressBankAccount, beneficiarieAddressBankAccount } = req.body;

    mysqlConnection.query("INSERT INTO beneficiaries VALUES (?, ?)", [addressBankAccount, beneficiarieAddressBankAccount],
        (err, rows, fields) => {
            if (!err) {
                res.send('Beneficiarie added')
            } else {
                console.log(err);
                res.status(404).send("Beneficiarie not added")
            }
        }
    )
})

beneficiariesRoute.delete("/api/beneficiaries", (req, res, next) => {
    const { addressBankAccount, beneficiarieAddressBankAccount } = req.body;

    mysqlConnection.query("DELETE FROM beneficiaries WHERE addressBankAccount = ? AND beneficiarieAddressBankAccount = ?",
    [addressBankAccount, beneficiarieAddressBankAccount], (err, rows) => {
        if (!err) {
            res.send("Beneficiarie deleted")
        } else{
            console.log(err)
            res.status(404).send("Beneficiarie not deleted")
        }
    }
    )
})


module.exports = beneficiariesRoute;
