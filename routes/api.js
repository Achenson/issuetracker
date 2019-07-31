/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const CONNECTION_STRING =
  "mongodb+srv://Achenson:dsf3Z1IKO1GCEZtv@mongo-for-fcc-13gh5.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => console.log("connection succesfull"))
  .catch(err => console.log(err));

module.exports = function (app) {


  const IssueSchema = new mongoose.Schema({
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    assigned_to: {
      type: String,
      default: ''
    },
    status_text: {
      type: String,
      default: ''
    }
  })

  const Issue = mongoose.model('Issue', IssueSchema);

  app.route('/api/issues/:project')


  
    .get(function (req, res){
      var project = req.params.project;
      


    })
    
    .post(function (req, res, next){
      var project = req.params.project;

      let newIssue = new Issue({
        
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text



      })

      newIssue.save( err => {
        if (err) return console.error(err)
      })


      next();


      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
