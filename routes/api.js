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

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const CONNECTION_STRING =
  "mongodb+srv://Achenson:dsf3Z1IKO1GCEZtv@mongo-for-fcc-13gh5.mongodb.net/test?retryWrites=true&w=majority";

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

  app
    .route("/api/issues/:project/post")

    .get(function(req, res) {



      var project = req.params.project;
    })

    .post(function(req, res, next) {
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

      res.json(newIssue);
    })


  //'put'
  app.route("/api/issues/:project/update").post(function(req, res, next) {
    var project = req.params.project;

    //  Issue.findById(req.body._id)
    //.exec((err, data) => {
    //  if (err) console.log('NOT FOUND');
    //console.log(data);
    //})

    let propsToChange = {
      issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text

    }

    
     let arrayfromObj= Object.entries(propsToChange).filter(

        ([key, value]) => [key, value != false]
      )
    

    



    console.log(arrayfromObj);

    //$set: { issue_text: req.body.issue_text }

    if(req.body.issue_text != false) {
      Issue.findOneAndUpdate(
        { _id: req.body._id },
  
        {
          $set: { issue_text: req.body.issue_text,
                 updated_on: new Date()
          },
          
        }
      ).exec((err, data) => {
        if (err) {
          console.error(err);
          res.json({ message: `could not update ${req.body._id}` });
        } else if (data === null) {
          res.json({ message: `could not update ${req.body._id}` });
        } else {
          console.log(data);
          res.json({ message: "successfully updated" });
        }
      });
    } else {
      res.json({message: "could not update"})
    }

 


  });

// delete
  app.route("/api/issues/:project/delete").post(function(req, res, next) {

    console.log(req.body._id);
    

    Issue.findByIdAndDelete(
      req.body._id
  
    ).exec((err,data) => {
      if (err) {
        console.error(err);
        res.json({ message: `could not delete ${req.body._id}` });
      } else if (data === null) {
        res.json({ message: `_id error` });
      } else {
        console.log(data);
        res.json({ message: "successfully deleted" });
      }
    })




  });


}
