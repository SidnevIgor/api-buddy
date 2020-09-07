const request = require('supertest');
let server, employee;
const { Store } = require('../stores/storeSchema');
const { Employee } = require('../employees/employerSchema');

describe('/api/stores', function() {
  beforeEach( async () => {
    if(!server) {
      server = require('../index');
    }
    employee = new Employee({
      firstName: "Igor2",
      lastName: "Sidnev",
      storeId: 1,
      position: "manager"
    });
    employee = await employee.save();
  });
  afterEach(async () => {
    server.close();
    await Store.remove({});
    await Employee.remove({});
  });

  describe('GET all stores', () => {
    it('should return all stores', async () => {
      await Store.collection.insertMany([
        {city: 't1'},
        {city: 't2'},
        {city: 't3'}
      ]);
      let res = await request(server).get('/api/stores');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });
    it('should return a Store with an additional parameter', async () => {
      await Store.collection.insertMany([
        {city: 't1', building: "100"},
        {city: 't2', building: "200"},
        {city: 't3', building: "300"}
      ]);
      let res = await request(server).get('/api/stores?building=200');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no Store is found', async () => {
      await Store.collection.insertMany([
        {city: 't1', building: 100}
      ]);
      let res = await request(server).get('/api/stores?building=200');
      expect(res.status).toBe(404);
    });
  });

  describe('GET one Store', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/stores/abc1234`);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/stores/2`);
      expect(res.status).toBe(404);
    });
    it('should retun one Store', async () => {
      let store = new Store({
        storeId: 1,
        city: 't1'
      })
      let storeSaved = await store.save();
      let res = await request(server).get(`/api/stores/${storeSaved.storeId}`);
      expect(res.body.city).toMatch(storeSaved.city);
    });
  });

  describe('POST one Store', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/stores').send({
        storeId: 1,
        city: 't1',
        building: 100
      });
      expect(res.status).toBe(400);
    });
    it('should return a 400 error when employeeId is wrong', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: ['abc1234']
      };
      let res = await request(server).post('/api/stores').send({...store});
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
      let res = await request(server).post('/api/stores').send({...store});
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
        employees: [1]
      };
      let res = await request(server).put(`/api/stores/abc1234`).send(store);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let store = {
        city: "Store9"
      };
      let res = await request(server).put(`/api/stores/1`).send(store);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let store = {
        storeId: 1,
        city: 'Moscow',
        street: 'Novosibirskaya',
        building: '6',
        postcode: '107497',
        employees: [1]
      };
      let res = await request(server).put(`/api/stores/2`).send(store);
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

      let res = await request(server).put(`/api/stores/${savedStore.ops[0].storeId}`).send({
        storeId: 1,
        city: 'Ufa',
        street: 'Novosibirskaya',
        building: '7',
        postcode: '107497',
        employees: ['abc1234']
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

      let res = await request(server).put(`/api/stores/${savedStore.ops[0].storeId}`).send({
        storeId: 1,
        city: 'Ufa',
        street: 'Novosibirskaya',
        building: '7',
        postcode: '107497',
        employees: [1]
      });
      expect(res.body.building).toEqual("7");
    });
  });

  describe('DELETE one Store', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/stores/abc1234');
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/stores/2');
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

      let res = await request(server).delete(`/api/stores/${savedStore.ops[0].storeId}`);
      expect(res.body.storeId).toBe(1);
    });
  })
});
