var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

//used for testing endpoints
chai.use(chaiHttp);

describe("GET - Routing Tests", function() {
  it("GET /api/issues/{project} => Array of objects with issue data", function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .query({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], "issue_title");
        assert.property(res.body[0], "issue_text");
        assert.property(res.body[0], "created_on");
        assert.property(res.body[0], "updated_on");
        assert.property(res.body[0], "created_by");
        assert.property(res.body[0], "assigned_to");
        assert.property(res.body[0], "open");
        assert.property(res.body[0], "status_text");
        assert.property(res.body[0], "_id");
        done();
      });
  });

  it("One filter", function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .query({ issue_title: "ancient" })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.propertyVal(res.body[0], "issue_title", "ancient");
        done();
      });
  });

  it("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .query({ created_by: "new", open: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.propertyVal(res.body[0], "created_by", "new");
        assert.propertyVal(res.body[0], "open", true);
        done();
      });
  });
});

describe("POST - Routing Tests", function() {
  it("POST object with issue data", function(done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");

        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(
          res.body.created_by,
          "Functional Test - Every field filled in"
        );
        assert.equal(res.body.assigned_to, "Chai and Mocha");
        assert.equal(res.body.status_text, "In QA");

        done();
      });
  });

  it("Required fields filled in", function(done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title2",
        issue_text: "text2",
        created_by: "Functional Test - required fields filled in"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");

        assert.equal(res.body.issue_title, "Title2");
        assert.equal(res.body.issue_text, "text2");
        assert.equal(
          res.body.created_by,
          "Functional Test - required fields filled in"
        );
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");

        done();
      });

   
  });

  it("Missing required fields", function(done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        created_by: "nobody"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.issue_title, undefined);


        done();
      });
  });



});


describe("PUT - Routing Tests", function() {

  it("No body", function(done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({_id: "5d480c5d2190de238c8d9480",
      issue_title: '',
      issue_text: '',
      created_by: '',
      assigned_to: '',
      status_text: ''

      
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");

        assert.equal(res.body.message, "no updated field sent");
        
        

        done();
      });
  });


  it("Wrong id", function(done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({_id: "random wrong id"
      
      })
      .end(function(err, res) {
       assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");

        assert.equal(res.body.message, `could not update random wrong id`);
        
        

        done();
      });


      
  });


  it('One field to update', function(done) {
    chai
    .request(server)
    .put("/api/issues/test")
    .send({_id: "5d480c5d2190de238c8d9480",
    issue_text: "testing one field update"
    
    })
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");

      assert.equal(res.body.issue_title, undefined);
      assert.equal(res.body.issue_text, `testing one field update`);

      assert.equal(res.body.created_by, undefined);
      assert.equal(res.body.assigned_to, undefined);
      assert.equal(res.body.status_text, undefined);
      
      
      

      done();
    });





    
  });







  
  });
