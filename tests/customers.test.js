const request = require('supertest');
let server;
const { Customer } = require('../customers/customers');

describe.skip('/api/customers', function() {
  beforeEach(() => {
    if(!server) {
      server = require('../index');
    }
  });
  afterEach(async () => {
    server.close();
    await Customer.remove({});
  });

  describe('GET all customers', () => {
    it('should return all customers', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/customers');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a Customer with an additional parameter', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/customers?firstName=t2');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no Customer is found', async () => {
      await Customer.collection.insertMany([
        {firstName: 't1'}
      ]);
      let res = await request(server).get('/api/customers?firstName=t2');
      expect(res.status).toBe(404);
    });
  });

  describe('GET one Customer', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/customers/abc1234`);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/customers/2`);
      expect(res.status).toBe(404);
    });
    it('should retun one Customer', async () => {
      let customer = new Customer({
        firstName: 't1'
      })
      let customersaved = await customer.save();
      let res = await request(server).get(`/api/customers/${customersaved.customerId}`);
      expect(res.body.firstName).toMatch(customersaved.firstName);
    });
  });

  describe('POST one Customer', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/customers').send({
        firstName: 't1'
      });
      expect(res.status).toBe(400);
    });
    it('should post a Customer', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "abc1234"
      };
      let res = await request(server).post('/api/auth').send({...customer});
      expect(res.body.firstName).toMatch(customer.firstName);
    });
  });

  describe('PUT one Customer', () => {
    it('should throw an error when id is invalid', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "abc1234"
      };
      let res = await request(server).put(`/api/customers/abc1234`).send(customer);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let customer = {
        title: "Customer9"
      };
      let res = await request(server).put(`/api/customers/2`).send(customer);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "abc1234"
      };
      let res = await request(server).put(`/api/customers/2`).send(customer);
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let customer = {
        customerId: 1,
        firstName: "name5",
        lastName: "lname4",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "abc1234"
      };
      let savedCustomer = await Customer.collection.insertMany([{...customer}]);

      let res = await request(server).put(`/api/customers/${savedCustomer.ops[0].customerId}`).send({
        customerId: 1,
        firstName: "name6",
        lastName: "lname6",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "abc1234"
      });
      expect(res.body.firstName).toEqual('name6');
    });
  });

  describe('DELETE one Customer', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/customers/abc1234');
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/customers/2');
      expect(res.status).toBe(400);
    });
    it('should delete one Customer', async () => {
      let сustomer = {
        customerId: 1,
        firstName: "name6",
        lastName: "lname6",
        email: "test@gmail.com",
        tel: "123-456-789",
        password: "abc1234"
      };
      let savedCustomer = await Customer.collection.insertMany([{...сustomer}]);

      let res = await request(server).delete(`/api/customers/${savedCustomer.ops[0].customerId}`);
      expect(res.body.customerId).toBe(1);
    });
  })
});
