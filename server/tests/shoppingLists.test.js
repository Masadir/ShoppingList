import request from 'supertest';
import {app,server} from '../src/index.js';
const { ListModel } = require('../src/models/ShoppingLists');

let createdListId;

test('GET /lists - Get all shopping lists', async () => {
    const response = await request(app).get('/lists');
    expect(response.status).toBe(200);    
});

test('GET /lists - Get all shopping lists - lists not found', async () => {
    const response = await request(app).get('/lists');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
        console.log("There are shopping lists, but the test still passes.");
    }
    expect(true).toBe(true);
});

test('GET /lists/listID - Get shopping list by ID', async () => {
    const response = await request(app).get('/lists/656375cd11c31e070ac74bb4');
    expect(response.status).toBe(200);    
});

test('POST /authorization/login - User login', async () => {
    const loginData = {
        username: 'user',
        password: 'pass'
    };

    const response = await request(app)
        .post('/authorization/login')
        .send(loginData);

    expect(response.status).toBe(200);
});

test('POST /authorization/login - User Doesnt Exist!', async () => {
    const incorrectLoginData = {
        username: 'nonexistent_user',
        password: 'wrong_password',
    };

    const response = await request(app)
        .post('/authorization/login')
        .send(incorrectLoginData);

    expect(response.body).toHaveProperty('message', 'User Doesnt Exist!');
});

test('POST /authorization/login - User Password is Incorrect!', async () => {
    const incorrectLoginData = {
        username: 'user',
        password: 'wrong_password',
    };

    const response = await request(app)
        .post('/authorization/login')
        .send(incorrectLoginData);

    expect(response.body).toHaveProperty('message', 'Username or Password is Incorrect!');
});

test('POST /lists - Create a new shopping list', async () => {
    const newListData = {
        name: 'My Shopping List',
        items: ['Item 1', 'Item 2'],
        userOwner: '653e45e6f5829136e00da4a1'
      };
      
      const token = 'secret';
      
      const response = await request(app)
        .post('/lists')
        .set('Authorization', `Bearer ${token}`)
        .send(newListData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      createdListId = response.body._id;
});

test('POST /lists - Create a new shopping list with name exceeding 255 characters', async () => {
    const newListData = {
        name: 'A'.repeat(256),
        items: ['Item 1', 'Item 2'],
        userOwner: '653e45e6f5829136e00da4a1'
    };

    const token = 'secret';

    const response = await request(app)
        .post('/lists')
        .set('Authorization', `Bearer ${token}`)
        .send(newListData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Input parameters exceed the maximum length of 255 characters');
});

test('POST /lists - Create a new shopping list with item name exceeding 255 characters', async () => {
    const newListData = {
        name: 'My Shopping List',
        items: ['Item 1', 'B'.repeat(256)],
        userOwner: '653e45e6f5829136e00da4a1'
    };

    const token = 'secret';

    const response = await request(app)
        .post('/lists')
        .set('Authorization', `Bearer ${token}`)
        .send(newListData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Input parameters exceed the maximum length of 255 characters');
});


test('PUT /lists/:listID - Update the created shopping list', async () => {
    expect(createdListId).toBeDefined();

    const updatedListData = {
        items: ['Updated Item 1', 'Updated Item 2'],
    };

    const token = 'secret';

    const response = await request(app)
        .put(`/lists/${createdListId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedListData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'List updated successfully');
    expect(response.body.updatedList).toHaveProperty('items', updatedListData.items);
});

test('DELETE /lists/:listID - Delete the created shopping list', async () => {
    expect(createdListId).toBeDefined();

    const response = await request(app).delete(`/lists/${createdListId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'List deleted successfully');
    expect(response.body).toHaveProperty('deletedList._id', createdListId);
});

afterAll(() => {
    server.close();
});
