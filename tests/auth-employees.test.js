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
      employeeId: 20,
      firstName: "Igor2",
      lastName: "Sidnev",
      storeId: 1,
      position: "manager"
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
      let res = await request(server).get(`/api/auth/employees/123dsfsd4`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when id is not found', async () => {
      let res = await request(server).get(`/api/auth/employees/2`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should retun one employee', async () => {
      let employee = new Employee({
        employeeId: 1,
        firstName: 't1'
      })
      let employeeSaved = await employee.save();
      let res = await request(server).get(`/api/auth/employees/${employeeSaved.employeeId}`).set('x-auth-token', token);
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
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: '1abc',
        position: "manager"
      });
      expect(res.status).toBe(400);
    });
    it('should post a employee', async () => {
      let employee = {
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: 1,
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
        storeId: 1,
        position: "manager"
      };
      let res = await request(server).put(`/api/auth/employees/123sdf4`).set('x-auth-token', token).send(employee);
      expect(res.status).toBe(404);
    });
    it('should throw an error when validation is not passed', async () => {
      let employee = {
        title: "employee9"
      };
      let res = await request(server).put(`/api/auth/employees/1`).set('x-auth-token', token).send(employee);
      expect(res.status).toBe(400);
    });
    it('should throw an error when id is not found', async () => {
      let employee = {
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: 1,
        position: "manager"
      };
      let res = await request(server).put(`/api/auth/employees/2`).set('x-auth-token', token).send(employee);
      expect(res.status).toBe(400);
    });
    it('should throw an error when store id is not valid', async () => {
      let employee = {
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: 1,
        position: "manager"
      };
      let savedEmployee = await Employee.collection.insertMany([{...employee}]);

      let res = await request(server).put(`/api/auth/employees/${savedEmployee.ops[0].employeeId}`).set('x-auth-token', token).send({
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: 'ABC',
        position: "manager"
      });
      expect(res.status).toBe(400);
    });
    it('should put an object in db', async () => {
      let employee = {
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: 1,
        position: "manager"
      };
      let savedemployee = await Employee.collection.insertMany([{...employee}]);

      let res = await request(server).put(`/api/auth/employees/${savedemployee.ops[0].employeeId}`).set('x-auth-token', token).send({
        employeeId: 1,
        firstName: "Igor1",
        lastName: "Sidnev",
        storeId: 1,
        position: "manager"
      });
      expect(res.body.firstName).toEqual('Igor1');
    });
  });

  describe('DELETE one employee', () => {
    it('should throw an error when ID validation is not passed', async () => {
      let res = await request(server).delete('/api/auth/employees/12abc34').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should throw an error when ID is not found', async () => {
      let res = await request(server).delete('/api/auth/employees/2').set('x-auth-token', token);
      expect(res.status).toBe(400);
    });
    it('should delete one employee', async () => {
      let employee = {
        employeeId: 1,
        firstName: "Igor2",
        lastName: "Sidnev",
        storeId: 1,
        position: "manager"
      };
      let savedemployee = await Employee.collection.insertMany([{...employee}]);

      let res = await request(server).delete(`/api/auth/employees/${savedemployee.ops[0].employeeId}`).set('x-auth-token', token);
      expect(res.body.employeeId).toBe(1);
    });
  })
});
