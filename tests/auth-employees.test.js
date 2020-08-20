const request = require('supertest');
const config = require('config'); //this is used to store hidden server variables
const jwt = require('jsonwebtoken');

let server, employee, token, result;
const { Employee } = require('../employees/employees');

describe('/api/auth/employees', function() {
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
    await Employee.remove({});
  });

  describe('GET all employees', () => {
    it('should return 401 error', async () => {
      await Employee.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/employees');
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
    it('should return all employees', async () => {
      await Employee.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/employees').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
    });
    it('should return a employee with an additional parameter', async () => {
      await Employee.collection.insertMany([
        {firstName: 't1'},
        {firstName: 't2'},
        {firstName: 't3'}
      ]);
      let res = await request(server).get('/api/auth/employees?firstName=t2').set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
    it('should return 404 when no employee is found', async () => {
      await Employee.collection.insertMany([
        {firstName: 't1'}
      ]);
      let res = await request(server).get('/api/auth/employees?firstName=t2').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
  });

  describe('GET one employee', () => {
    it('should throw an error when id is invalid', async () => {
      let res = await request(server).get(`/api/auth/employees/1234`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/auth/employees/5f355ce806f38631fc33530d`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should retun one employee', async () => {
      let employee = new Employee({
        firstName: 't1'
      })
      let employeeSaved = await employee.save();
      let res = await request(server).get(`/api/auth/employees/${employeeSaved._id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.firstName).toMatch(employeeSaved.firstName);
    });
  });

  describe('POST one employee', () => {
    it('should return validation error', async () => {
      let res = await request(server).post('/api/auth/employees').set('x-auth-token', token).send({
        firstName: 't1'
      });
      expect(res.status).toBe(400);
    });
    it('should return an error when storeId is not valid', async () => {
      let res = await request(server).post('/api/auth/employees').set('x-auth-token', token).send({
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: "1",
        position: "manager"
      });
      expect(res.status).toBe(400);
    });
    it('should post a employee', async () => {
      let employee = {
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      };
      let res = await request(server).post('/api/auth/employees').set('x-auth-token', token).send({...employee});
      expect(res.body.firstName).toMatch(employee.firstName);
    });
  });

  describe('PUT one employee', () => {
    it('should throw an error when id is invalid', async () => {
      let employee = {
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      };
      let res = await request(server).put(`/api/auth/employees/1234`).set('x-auth-token', token).send(employee);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let employee = {
        title: "employee9"
      };
      let res = await request(server).put(`/api/auth/employees/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(employee);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let employee = {
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      };
      let res = await request(server).put(`/api/auth/employees/5f2178c4b1ef5441280c2366`).set('x-auth-token', token).send(employee);
      expect(res.status).toBe(400);
    });
    it('should throw an error when store id is not valid', async () => {
      let employee = {
        firstName: "Igor1",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      };
      let savedEmployee = await Employee.collection.insertMany([{...employee}]);

      let res = await request(server).put(`/api/auth/employees/${savedEmployee.ops[0]._id}`).set('x-auth-token', token).send({
        firstName: "Igor1",
        lastName: "Sidnev",
        storeId: "1",
        position: "manager"
      });
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let employee = {
        firstName: "Igor1",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      };
      let savedemployee = await Employee.collection.insertMany([{...employee}]);

      let res = await request(server).put(`/api/auth/employees/${savedemployee.ops[0]._id}`).set('x-auth-token', token).send({
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      });
      expect(res.body.firstName).toEqual('Igor1');
    });
  });

  describe('DELETE one employee', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/auth/employees/1234').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/auth/employees/5f2178c4b1ef5441280c2366').set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should delete one employee', async () => {
      let employee = {
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: "5f22e7c0f401da21084d739d",
        position: "manager"
      };
      let savedemployee = await Employee.collection.insertMany([{...employee}]);

      let res = await request(server).delete(`/api/auth/employees/${savedemployee.ops[0]._id}`).set('x-auth-token', token);
      expect(res.body.deletedCount).toBe(1);
    });
  })
});
