const request = require('supertest');
const bcrypt = require('bcrypt');

let server, customer;
const { Customer } = require('../customers/customers');

describe('Testing auth validation', () => {
  beforeEach( async () => {
    if(!server) {
      server = require('../index');
    }
    customer = {
      firstName: 'Igor',
      lastName: 'Sidnev',
      email: 'test@gmail.com',
      tel: '123 45 67',
      password: 'Qwerty'
    };
  });
  afterEach( async () => {
    server.close();
    await Customer.remove({});
  });

  it('should return a Customer schema validation error', async () => {
    let res = await request(server).post('/api/auth').send({
      name: 'Igor'
    });
    expect(res.status).toBe(400);
  });
  it('should create a new Customer', async () => {
    let res = await request(server).post('/api/auth').send(customer);
    expect(res.status).toBe(200);
  });
/*  it('should return me', async () => {
    let me = await request(server).post('/api/auth').send(customer);
    console.log(me.header['x-auth-token']);
    let res = await request(server).get('/api/me').header('x-auth-token', me.header['x-auth-token']);
    console.log(res.body);
    expect(res.status).toBe(200);
  }); */ 
});
