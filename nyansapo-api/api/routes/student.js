/*const express = require('express');
const router = express.Router(); // initialize router
const mongoose = require('mongoose'); // import mongoose for database

// import data base models
const Student = require('../models/student');
const { restart } = require('nodemon');
const { json } = require('body-parser');
const checkAuth = require('../middleware/check-auth');

// GET all students in database 
router.get('/', checkAuth, (req, res, next) => {
    Student.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs) // return all docs
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// POST: register an student
router.post('/', checkAuth, (req, res, next) => {

    // create an student object with the instructor model and request info
    const student = new Student({
        _id: new mongoose.Types.ObjectId(),
        instructor_id: req.body.instructor_id, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.gender,
        notes: req.body.notes,
        learning_level: req.body.learning_level
    }); 

    // save the instructor object into database
    student.save().then( result => {
        console.log("Saved to Database",result);

            // return a response 
        res.status(200).json({
            message: 'Student successfully saved',
            createdProduct : result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
   
});

// GET a specific instructors students by student ID
router.get('/instructor/:instructorId', checkAuth, (req, res, next) =>{

});

// GET a specific student by student ID
router.get('/:studentId', checkAuth, (req, res, next) =>{

});

// PATCH: update student info
router.patch('/:studentId', checkAuth, (req, res, next) =>{

});

// DELETE: remove a student 
router.delete('/:studentId', checkAuth, (req, res, next) =>{

});

module.exports = router;
*/
const express = require('express');
const router = express.Router(); // initialize router
const mongoose = require('mongoose'); // import mongoose for database

// import data base models
const Student = require('../models/student');
const { restart } = require('nodemon');
const { json } = require('body-parser');
const checkAuth = require('../middleware/check-auth');

// GET all students in database 
router.get('/', checkAuth, (req, res, next) => {
    Student.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs) // return all docs
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// POST: register an student
router.post('/signup', checkAuth, (req, res, next) => {

    // check to see if email is already in database
    Student.find({email: req.body.email })
    .exec()
    .then(user => {
        if(user.length >=1 ){ // if there is a user with email
            return res.status(422).json({
                message: "Email exist"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
    
    // hash password
    hashpassword = passwordHash.generate(req.body.password); 

    // create an student object with the student model and request info
    const student = new Student({
        _id: new mongoose.Types.ObjectId(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashpassword
    }); 

    // save the student object into database
    student.save().then( result => {
        console.log("Saved to Database",result);

         // return a response 
        res.status(200).json({
            message: ' Student successfully saved',
            createdProduct : result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});

// GET a specific student by student ID
router.get('instructorid/:studentId', checkAuth, (req, res, next) =>{
    Student.find({instructor_id: req.params.instructorId })
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs) // return all docs
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// GET a specific student by student ID
router.get('/:studentId', checkAuth, (req, res, next) =>{
    
    // get id from request 
    const id = req.params.studentId; 

    // query the database with model using the id
    Student.findById(id)
    .exec()
    .then(doc => {
        console.log("From Database",doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            console.log(id);
            res.status(404).json({message:'Not a valid Id'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

// PATCH: update student info
router.patch('/:studentId', checkAuth, (req, res, next) =>{
    const id = req.params.StudentId; // get the id

    const updateOps = {};  // get all params that need to be updated
    for (const ops of req.body.updates){
        if (ops.propName === "password"){ // if password needs update hash it
            hashpassword = passwordHash.generate(ops.value); // hash password
            updateOps[ops.propName] = hashpassword;
        }else{
            updateOps[ops.propName] = ops.value; 
        }
    }

    Student.update({_id: id}, {$set: updateOps}) // update the params with request values
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});

// DELETE: remove a student 
router.delete('/:studentId', checkAuth, (req, res, next) =>{
    const id = req.params.studentId;
    Student.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Successfully deleted Student",
            student : result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

module.exports = router;