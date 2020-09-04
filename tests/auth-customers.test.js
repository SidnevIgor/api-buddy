const request = require('supertest');
const config = require('config'); //this is used to store hidden server variables
const jwt = require('jsonwebtoken');

let server, customer, token, result;
const { Customer } = require('../customers/customers');

describe('/api/auth/customers', function() {
  beforeEach( async () => {
    if(!server) {
      server = require('../index');
    }
    customer = new Customer({
      firstName: "name5",
      lastName: "lname4",
      email: "test@gmail.com",
      tel: "123-456-789"
    });
    result = await customer.save();
    token = jwt.sign({_id: result._id}, config.get('secret'));
  });
  afterEach(async () => {
    server.close();
    await Customer.remove({});
  });

  describe('GET all customers', () => {
    it('should return 401 error', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/customers');
      expect(res.status).toBe(401);
    });
    it('should return 400 error', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/customers').set('x-auth-token', '1234');
      expect(res.status).toBe(400);
    });
    it('should return all customers', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/customers').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
    });
    it('should return a customer with an additional parameter', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/customers?firstName=t2').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no customer is found', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'}
      ]);
      let res = await request(server).get('/api/auth/customers?firstName=t2').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
  });

  describe('GET one customer', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/auth/customers/12dsg34`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/auth/customers/2`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should retun one customer', async () => {
      let customer = new Customer({
        firstName: 't1'
      })
      let customersaved = await customer.save();
      let res = await request(server).get(`/api/auth/customers/${customersaved.customerId}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.firstName).toMatch(customersaved.firstName);
    });
  });

  describe('POST one customer', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/auth/customers').set('x-auth-token', token).send({
        firstName: 't1'
      });
      expect(res.status).toBe(400);
    });
    it('should post a customer', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "1234"
      };
      let res = await request(server).post('/api/auth').set('x-auth-token', token).send({...customer});
      expect(res.body.firstName).toMatch(customer.firstName);
    });
  });

  describe('PUT one customer', () => {
    it('should throw an error when id is invalid', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "1234"
      };
      let res = await request(server).put(`/api/auth/customers/sdjhfg`).set('x-auth-token', token).send(customer);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let customer = {
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789"
      };
      let res = await request(server).put(`/api/auth/customers/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(customer);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "1234"
      };
      let res = await request(server).put(`/api/auth/customers/2`).set('x-auth-token', token).send(customer);
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "1234"
      };
      let savedcustomer = await Customer.collection.insertMany([{...customer}]);

      let res = await request(server).put(`/api/auth/customers/${savedcustomer.ops[0].customerId}`).set('x-auth-token', token).send({
        customerId: 1,
        firstName: "name6",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "123456"
      });
      expect(res.body.firstName).toEqual('name6');
    });
  });

  describe('DELETE one customer', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/auth/customers/12dff34').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/auth/customers/2').set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should delete one customer', async () => {
      let customer = {
        customerId: 1,
        firstName: "name6",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "123456"
      };
      let savedcustomer = await Customer.collection.insertMany([{...customer}]);

      let res = await request(server).delete(`/api/auth/customers/${savedcustomer.ops[0].customerId}`).set('x-auth-token', token);
      expect(res.body.customerId).toBe(1);
    });
  })
});
