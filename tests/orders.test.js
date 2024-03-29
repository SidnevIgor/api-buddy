const request = require('supertest');
let server;
const { Order } = require('../orders/orderschema');

describe('/api/orders', function() {
  beforeEach(() => {
    if(!server) {
      server = require('../index');
    }
  });
  afterEach(async () => {
    server.close();
    await Order.remove({});
  });

  describe('GET all orders', () => {
    it('should return all orders', async () => {
      await Order.collection.insertMany([
        {orderTotal: 100},
        {orderTotal: 200},
        {orderTotal: 300}
      ]);
      let res = await request(server).get('/api/orders');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a Order with an additional parameter', async () => {
      await Order.collection.insertMany([
        {orderTotal: 100},
        {orderTotal: 200},
        {orderTotal: 300}
      ]);
      let res = await request(server).get('/api/orders?orderTotal=200');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no Order is found', async () => {
      await Order.collection.insertMany([
        {orderTotal: 100}
      ]);
      let res = await request(server).get('/api/orders?orderTotal=200');
      expect(res.status).toBe(404);
    });
  });

  describe('GET one Order', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/orders/abc1234`);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/orders/2`);
      expect(res.status).toBe(404);
    });
    it('should return one Order', async () => {
      let order = new Order({
        orderId: 1,
        orderTotal: 100
      })
      let orderSaved = await order.save();
      let res = await request(server).get(`/api/orders/${orderSaved.orderId}`);
      expect(res.body.orderTotal).toEqual(orderSaved.orderTotal);
    });
  });

  describe('POST one Order', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/orders').send({
        orderTotal: 100,
        price: 100
      });
      expect(res.status).toBe(400);
    });
    it('should throw a 400 error as ID is not validated', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: "abc1234",
        customerId: "5f22d957e986174428de4326",
        orderTotal: 1000,
        books: ["5f2178c4b1ef5441280c2366","5f2178c4b1ef5441280c2366"]
      };
      let res = await request(server).post('/api/orders').send({...order});
      expect(res.status).toBe(400);
    });
    it('should post a Order', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2]
      };
      let res = await request(server).post('/api/orders').send({...order});
      expect(res.body.orderTotal).toEqual(order.orderTotal);
    });
  });

  describe('PUT one Order', () => {
    it('should throw an error when id is invalid', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2]
      };
      let res = await request(server).put(`/api/orders/abc1234`).send(order);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let order = {
        orderTotal: "Order9"
      };
      let res = await request(server).put(`/api/orders/1`).send(order);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2]
      };
      let res = await request(server).put(`/api/orders/2`).send(order);
      expect(res.status).toBe(400);
    });
    it('should throw a 400 error', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2]
      };
      let savedOrder = await Order.collection.insertMany([{...order}]);

      let res = await request(server).put(`/api/orders/${savedOrder.ops[0].orderId}`).send({
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,'2abc']
      });
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2]
      };
      let savedOrder = await Order.collection.insertMany([{...order}]);

      let res = await request(server).put(`/api/orders/${savedOrder.ops[0].orderId}`).send({
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2,3]
      });
      expect(res.body.books.length).toEqual(3);
    });
  });

  describe('DELETE one Order', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/orders/abc1234');
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/orders/2');
      expect(res.status).toBe(400);
    });
    it('should delete one Order', async () => {
      let order = {
        orderId: 1,
        date: "10.10.2020",
        employeeId: 1,
        customerId: 1,
        orderTotal: 1000,
        books: [1,2]
      };
      let savedOrder = await Order.collection.insertMany([{...order}]);

      let res = await request(server).delete(`/api/orders/${savedOrder.ops[0].orderId}`);
      expect(res.body.orderId).toBe(1);
    });
  })
});
