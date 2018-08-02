"use strict";

require('dotenv').config();
const dogBreed = require('what-dog');
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const app = express();
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const database = require("./database")(knex);
const bodyParser = require("body-parser");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended:true
})); 

app.post('/api/whatDog', (req, res) => {
    let dogUrl = req.body.dogUrl
    console.log(dogUrl)
    dogBreed(dogUrl).then(doggyData => {
        res.send({doggyData})
    })
})

app.post('/api/pets/:id', (req, res) => {
   database.editPet(req.body)
   .then(function(result) {
       return res.sendStatus(204)
})
})

app.post('/api/pets/:id/activity', (req, res) => {
    console.log(req.body)
   database.newHistory(req.body)
   .then(function(result) {
       return res.sendStatus(204)
})
})

app.post('/api/pets/', (req, res) => {
    database.getPets(req.body.userId)
    .then(function (result) {
        res.send(result)
    })
})

app.post('/api/pet/', (req, res) => {
     database.getPet(req.body.id)
     .then(function (result) {
         res.send(result)
     })
 })

 app.post('/api/pet/new', (req, res) => {
     database.newPet(req.body)
 })

 app.post('/api/signup', async (req, res) => {
    if (!database.verifySignup(req.body).length) {
     let user = await database.insertAccount(req.body)
     res.send(user)
    } else {
        res.send('already found')
    }
 })

 app.post('/api/login', async (req, res) => {
    let user = await database.verifyLogin(req.body)
    if (user.length) {
        res.send(user)
    } else {
        res.send("no user found")
    }
 })


app.listen(PORT, () => {
 console.log("Example app listening on port " + PORT);
});


