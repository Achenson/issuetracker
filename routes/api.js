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
    .route("/api/issues/:project/")
    .get(function(req, res) {
      

      let objectOfQueries = req.query
      objectOfQueries.project_name = req.params.project


      Issue.find(objectOfQueries)
        .exec( (err, data) => {
          if (err) return console.error(err)

          
          

            res.json(data)
      
        

        




    })

  })
  app
    .route("/api/issues/:project/post")

   

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
    });

  //'put'
  app.route("/api/issues/:project/update").post(function(req, res, next) {
    var project = req.params.project;
    //this object will be turn to array, filtered(in order not to uptade
    //properties which were not filled be the user), turn to object again
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
    /// to change???
    if (req.body.open) {
      changedObj.open = false;
    } else {
      changedObj.open = true;
    }

    console.log(arrayfromObj);
    console.log(changedObj);

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
      } else if (data === null) {
        res.json({ message: `could not update ${req.body._id}` });
      } else {
        console.log(data);
        res.json({ message: "successfully updated" });
      }
    });
  });

  // delete
  app.route("/api/issues/:project/delete").post(function(req, res, next) {
    console.log(req.body._id);

    Issue.findByIdAndDelete(req.body._id).exec((err, data) => {
      if (err) {
        console.error(err);
        res.json({ message: `could not delete ${req.body._id}` });
      } else if (data === null) {
        res.json({ message: `_id error` });
      } else {
        console.log(data);
        res.json({ message: "successfully deleted" });
      }
    });
  });
};
