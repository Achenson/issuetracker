/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
var mongoose = require("mongoose");
var dotenv = require('dotenv');

dotenv.config();

//const CONNECTION_STRING='mongodb+srv://<Username>:<password>@mongo-for-fcc-13gh5.mongodb.net/test?retryWrites=true&w=majority';
const CONNECTION_STRING = process.env.DB; // install dotenv, require it, dotenv.config()



mongoose
  .connect(CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => console.log("connection succesfull"))
  .catch(err => console.log(err));

module.exports = function(app) {
  const IssueSchema = new mongoose.Schema({
    project_name: {
      type: String
    },
    issue_title: {
      type: String,
      required: true
      //default: ''
    },
    issue_text: {
      type: String,
      required: true
      //default: ''
    },
    created_by: {
      type: String,
      required: true
      //default: ''
    },
    assigned_to: {
      type: String,
      default: ""
    },
    status_text: {
      type: String,
      default: ""
    },
    created_on: {
      type: Date,
      default: new Date()
    },

    updated_on: {
      type: Date,
      default: new Date()
    },
    open: {
      type: Boolean,
      default: true
    }
  });

  const Issue = mongoose.model("Issue", IssueSchema);

  app.route("/api/issues/:project/").get(function(req, res) {
     //eg. http://localhost:4000/api/issues/apitest?open=true
    


    //object from all the queries
    let objectOfQueries = req.query;
    //adding one property coming from params (not queries)
    objectOfQueries.project_name = req.params.project;


    Issue.find(objectOfQueries).exec((err, data) => {
      if (err) return console.error(err);

      res.json(data);
    });
  });

  //post
  app
    .route("/api/issues/:project/")

    .post(function(req, res, next) {
      console.log("posting");

      var project = req.params.project;

      let newIssue = new Issue({
        project_name: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      });

      newIssue.save(err => {
        if (err) return console.error(err);
      });

      console.log(req.body);
      res.json(newIssue);

      //next();
    });

  //'put'
  app.route("/api/issues/:project/").put(function(req, res, next) {
    console.log("putting");

    var project = req.params.project;
    //this object will be turn to array, filtered (in order not to update
    //properties which were not filled be the user - ''), turn to object again
    // and then passed to $set in findOneAndUpdate
    let propsToChange = {
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_by: req.body.created_by,
      assigned_to: req.body.assigned_to,
      status_text: req.body.status_text
    };

    let arrayfromObj = Object.entries(propsToChange).filter(el => el[1] !== "");

    let changedObj = { updated_on: new Date() };

    for (let el of arrayfromObj) {
      changedObj[el[0]] = el[1];
    }
    /// seems counterintuitive - that's because in html form input is named open and by default is unchecked - false value in html form
    if (req.body.open) {
      changedObj.open = false;
    } else {
      changedObj.open = true;
    }

    console.log("TCL: arrayfromObj", arrayfromObj);
    console.log("TCL: changedObj", changedObj);
    console.log(Object.keys(changedObj).length);
    

    //$set: { issue_text: req.body.issue_text }

    Issue.findOneAndUpdate(
      { _id: req.body._id },

      {
        $set: changedObj
      }
    ).exec((err, data) => {
      


      if (err) {
        console.error(err);

        
        res.json({ message: `could not update ${req.body._id}` });

        // if only _id is submitted, the changedObj will consist of new Data & open
      } else if (Object.keys(changedObj).length === 2) {
        console.log('no updated fiel sent');
       res.json({ message: `no updated field sent` });
      return;

      } else  {


        console.log('successfully updated');
        
       // res.json(changedObj);
        res.json({ message: 'successfully updated'})

      }
    });
  });

  // delete
  app.route("/api/issues/:project/").delete(function(req, res, next) {
    console.log(req.body._id);

    Issue.findByIdAndDelete(req.body._id).exec((err, data) => {
      if (req.body._id === '') {
        res.json({ message: `_id error` })
      } else if (err) {
        console.error(err);
        res.json({ message: `could not delete ${req.body._id}` });
      } else {
        console.log(data);
        res.json({ message: `deleted ${req.body._id}` });
      }
    });
  });
};
