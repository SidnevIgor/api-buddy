const jwt = require('jsonwebtoken');
const config = require('config'); //this is used to store hidden server variables
const request = require('supertest');

let server, employee, token;
const { Store } = require('../stores/storeSchema');
const { Employee } = require('../employees/employerSchema');
const { Customer } = require('../customers/customerSchema');

describe('/api/auth/stores', function() {
  beforeEach( async () => {
    if(!server) {
      server = require('../index');
    }
    employee = new Employee({
      firstName: "Igor2",
      lastName: "Sidnev",
      storeId: "5f355ce806f38631fc33530d",
      position: "manager"
    });
    employee = await employee.save();

    customer = new Customer({
      firstName: "name5",
      lastName: "lname4",
      email: "test@gmail.com",
      tel: "123-456-789"
    });
    let result = await customer.save();
    token = jwt.sign({_id: result._id}, config.get('secret'));
  });
  afterEach(async () => {
    server.close();
    await Store.remove({});
    await Employee.remove({});
    await Customer.remove({});
  });

  describe('GET all stores', () => {
    it('should return 401 error', async () => {
      await Store.collection.insertMany([
        {city: 't1'},
        {city: 't2'},
        {city: 't3'}
      ]);
      let res = await request(server).get('/api/auth/stores');
      expect(res.status).toBe(401);
    });
    it('should return 400 error', async () => {
      await Store.collection.insertMany([
        {city: 't1'},
        {city: 't2'},
        {city: 't3'}
      ]);
      let res = await request(server).get('/api/auth/stores').set('x-auth-token', '1234');
      expect(res.status).toBe(400);
    });
    it('should return all stores', async () => {
      await Store.collection.insertMany([
        {city: 't1'},
        {city: 't2'},
        {city: 't3'}
      ]);
      let res = await request(server).get('/api/auth/stores').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a Store with an additional parameter', async () => {
      await Store.collection.insertMany([
        {city: 't1', building: "100"},
        {city: 't2', building: "200"},
        {city: 't3', building: "300"}
      ]);
      let res = await request(server).get('/api/auth/stores?building=200').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no Store is found', async () => {
      await Store.collection.insertMany([
        {city: 't1', building: 100}
      ]);
      let res = await request(server).get('/api/auth/stores?building=200').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
  });

  describe('GET one Store', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/auth/stores/1abc234`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/auth/stores/2`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should retun one Store', async () => {
      let store = new Store({
        city: 't1'
      })
      let storeSaved = await store.save();
      let res = await request(server).get(`/api/auth/stores/${storeSaved.storeId}`).set('x-auth-token', token);
      expect(res.body.city).toMatch(storeSaved.city);
    });
  });

  describe('POST one Store', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/auth/stores').set('x-auth-token', token).send({
        city: 't1',
        building: 100
      });
      expect(res.status).toBe(400);
    });
    it('should return 400 error', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: ['1234']
      };
      let res = await request(server).post('/api/auth/stores').set('x-auth-token', token).send({...store});
      expect(res.status).toBe(400);
    });
    it('should post a Store', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [1]
      };
      let res = await request(server).post('/api/auth/stores').set('x-auth-token', token).send({...store});
      expect(res.body.city).toMatch(store.city);
    });
  });

  describe('PUT one Store', () => {
    it('should throw an error when id is invalid', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [employee._id]
      };
      let res = await request(server).put(`/api/auth/stores/12abc34`).set('x-auth-token', token).send(store);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let store = {
        city: "Store9"
      };
      let res = await request(server).put(`/api/auth/stores/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(store);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [employee._id]
      };
      let res = await request(server).put(`/api/auth/stores/2`).set('x-auth-token', token).send(store);
      expect(res.status).toBe(400);
    });
    it('should throw 400 error', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [employee._id]
      };
      let savedStore = await Store.collection.insertMany([{...store}]);

      let res = await request(server).put(`/api/auth/stores/${savedStore.ops[0].storeId}`).set('x-auth-token', token).send({
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '7',
        postcode: '107497',
        employees: ['1234']
      });
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [1]
      };
      let savedStore = await Store.collection.insertMany([{...store}]);

      let res = await request(server).put(`/api/auth/stores/${savedStore.ops[0].storeId}`).set('x-auth-token', token).send({
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '8',
        postcode: '107497',
        employees: [1]
      });
      expect(res.body.building).toEqual('8');
    });
  });

  describe('DELETE one Store', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/auth/stores/1abc234').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/auth/stores/2').set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should delete one Store', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [1]
      };
      let savedStore = await Store.collection.insertMany([{...store}]);

      let res = await request(server).delete(`/api/auth/stores/${savedStore.ops[0].storeId}`).set('x-auth-token', token);
      expect(res.body.storeId).toBe(1);
    });
  })
});
