var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

//used for testing endpoints
chai.use(chaiHttp);

describe("Routing Tests", function() {

  it('GET /api/issues/{project} => Array of objects with issue data', function(done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .query({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
      });
  });

  it('One filter', function(done) {
    chai
    .request(server)
    .get("/api/issues/apitest")
    .query({issue_title: "ancient"})
    .end(function(err, res) {
      assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.propertyVal(res.body[0], 'issue_title', 'ancient');
        done();
    });


  });


  it('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
    chai
    .request(server)
    .get("/api/issues/apitest")
    .query({created_by: "new",
  open: true})
    .end(function(err, res) {
      assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.propertyVal(res.body[0], 'created_by', 'new');
        assert.propertyVal(res.body[0], 'open', true);
        done();
    });


  });







 
});
