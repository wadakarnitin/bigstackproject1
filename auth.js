const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const key = require("../../setup/myurl");
//@type GET
//@route /api/auth
//@desc just for testing
//@access Public
router.get("/", (req, res) => {
  res.json({ test: "auth is being tested" });
});

//Import Schema for Person to register
const Person = require("../../models/Person");

//@type POST
//@route /api/auth/register
//@desc just for testing
//@access Public
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res
          .status(400)
          .json({ emailerror: "Email is already registered in our system" });
      } else {
        //creating an object to be passed to db
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        //Encrypt password using bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            newPerson.password = hash;
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//@type POST
//@route /api/auth/login
//@desc route for login of users
//@access Public

router.post("/login", (req, res) => {
  const email = res.body.email;
  const password = res.body.password;
  Person.findOne({ email })
    .then(person => {
       if(!person){
         return res.status(400).json({emailerror:'user not found with this email'});
       }
       bcrypt.compare(password, person.password)
       .then(isCorrect =>{
          if(isCorrect){
            res.json({success:'User logged in successfully'})
          }
          else {
            res.status(404).json({passworderror:'password is not correct'})
          }
       })
    })
    .catch(err => console.log(err));
});

module.exports = router;
