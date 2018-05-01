const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app,runServer,closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('Recipes', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list recipes on GET', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.be.a('array');
      expect(res.body.length).to.be.at.least(1);
      const expectedKeys = ['id','name','ingredients'];
      res.body.forEach(function(item) {
        expect(item).to.be.a('object');
        expect(item).to.include.keys(expectedKeys);
      });
    });
  });

  it('should add a new item on POST', function() {
    const newRecipe = {name:'Kanye Sandwich', ingredients: ['poop','ditty','scoop','poop']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id','name','ingredients');
        expect(res.body).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newRecipe,{id: res.body.id}));
      });
  });

  it('should update items on PUT', function() {
    const updateRecipe = {
      name: 'Kim K Sandwich',
      ingredients: ['instagram','iphone','plastic surgery']
    };

    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateRecipe.id = res.body[0].id;

        return chai.request(app)
          .put(`/recipes/${updateRecipe.id}`)
          .send(updateRecipe);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateRecipe);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
            .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
