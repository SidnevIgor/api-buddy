const request = require('supertest');
const config = require('config'); //this is used to store hidden server variables
const jwt = require('jsonwebtoken');

let server, employee, result, token;
const { Order } = require('../orders/orderschema');
const { Employee } = require('../employees/employees');

describe('/api/orders', function() {
  beforeEach( async () => {
    if(!server) {
      server = require('../index');
    }
    employee = new Employee({
      firstName: "name5",
      lastName: "lname4",
      email: "test@gmail.com",
      tel: "123-456-789"
    });
    result = await employee.save();
    token = jwt.sign({_id: result._id}, config.get('secret'));
  });
  afterEach(async () => {
    server.close();
    await Order.remove({});
    await Employee.remove({});
  });

  describe('GET all orders', () => {
    it('should return 401 error', async () => {
      await Order.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/orders');
      expect(res.status).toBe(401);
    });
    it('should return 400 error', async () => {
      await employee.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/employees').set('x-auth-token', '1234');
      expect(res.status).toBe(400);
    });
    it('should return all orders', async () => {
      await Order.collection.insertMany([
        {orderTotal: 100},
        {orderTotal: 200},
        {orderTotal: 300}
      ]);
      let res = await request(server).get('/api/auth/orders').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a Order with an additional parameter', async () => {
      await Order.collection.insertMany([
        {orderTotal: 100},
        {orderTotal: 200},
        {orderTotal: 300}
      ]);
      let res = await request(server).get('/api/auth/orders?orderTotal=200').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no Order is found', async () => {
      await Order.collection.insertMany([
        {orderTotal: 100}
      ]);
      let res = await request(server).get('/api/auth/orders?orderTotal=200').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
  });

  describe('GET one Order', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/auth/orders/1234`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/auth/orders/5f355ce806f38631fc33530d`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return one Order', async () => {
      let order = new Order({
        orderTotal: 100
      })
      let orderSaved = await order.save();
      let res = await request(server).get(`/api/auth/orders/${orderSaved._id}`).set('x-auth-token', token);
      expect(res.body.orderTotal).toEqual(orderSaved.orderTotal);
    });
  });

  describe('POST one Order', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/auth/orders').set('x-auth-token', token).send({
        orderTotal: 100,
        price: 100
      });
      expect(res.status).toBe(400);
    });
    it('should throw a 400 error as ID is not validated', async () => {
      let order = {
        date: "10.10.2020",
        employeeId: "1234",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let res = await request(server).post('/api/auth/orders').set('x-auth-token', token).send({...order});
      expect(res.status).toBe(400);
    });
    it('should post a Order', async () => {
      let order = {
        date: "10.10.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let res = await request(server).post('/api/auth/orders').set('x-auth-token', token).send({...order});
      expect(res.body.orderTotal).toEqual(order.orderTotal);
    });
  });

  describe('PUT one Order', () => {
    it('should throw an error when id is invalid', async () => {
      let order = {
        date: "10.10.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let res = await request(server).put(`/api/auth/orders/1234`).set('x-auth-token', token).send(order);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let order = {
        orderTotal: "Order9"
      };
      let res = await request(server).put(`/api/auth/orders/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(order);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let order = {
        date: "10.10.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let res = await request(server).put(`/api/auth/orders/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(order);
      expect(res.status).toBe(400);
    });
    it('should throw a 400 error', async () => {
      let order = {
        date: "10.10.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let savedOrder = await Order.collection.insertMany([{...order}]);

      let res = await request(server).put(`/api/auth/orders/${savedOrder.ops[0]._id}`).set('x-auth-token', token).send({
        date: "11.11.2020",
        employeeId: "1234",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 2000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      });
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let order = {
        date: "10.10.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let savedOrder = await Order.collection.insertMany([{...order}]);

      let res = await request(server).put(`/api/auth/orders/${savedOrder.ops[0]._id}`).set('x-auth-token', token).send({
        date: "11.11.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 2000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      });
      expect(res.body.orderTotal).toEqual(1000);
    });
  });

  describe('DELETE one Order', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/auth/orders/1234').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/auth/orders/5f2178c4b1ef5441280c2366').set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should delete one Order', async () => {
      let order = {
        date: "11.11.2020",
        employeeId: "5f22e022d99a4548a4b7ce7b",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 2000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let savedOrder = await Order.collection.insertMany([{...order}]);

      let res = await request(server).delete(`/api/auth/orders/${savedOrder.ops[0]._id}`).set('x-auth-token', token);
      expect(res.body.deletedCount).toBe(1);
    });
  })
});
