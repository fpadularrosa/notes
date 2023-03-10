const supertest = require('supertest');
const app = require('../src/server.js');
const { test } = require('@jest/globals');
const api = supertest(app);
const { User } = require('../src/models/User.schema.js');
const { openServer, closeServer } = require('../src/helpers/utils.js');

beforeEach(
    async () =>
{
   await openServer();
   const user = new User({ name: 'testing', email: 'testing12@email.com', password: '12testing@Pl', gender: 'Non-Binarie' })
   await user.save();
});

describe(
    'User model.',
    () => 
    {
        test(
            'Name, email and password of the user should be strings. else return 400',
            async () => 
            {
                await api.post('/api/auth/register')
                .send({ name: 136, email: 1, password: 88 })
                .expect(400)
                .expect('Content-Type', /json/);

                await api.post('/api/auth/register')
                .send({ name: 'test2', email: 'testing2@email.com', password: '12testing@Pl', gender: 'Non-Binarie'  })
                .expect(200)
                .expect('Content-Type', /json/);
            }
        ),
        test(
            'If name or email or password are equal to empty string, should return bad request.',
            async () => 
            {
                await api.post('/api/auth/register')
                .send({ name: 'testing', email: '', password: '12testing@Pl' })
                .expect(400)
                .expect('Content-Type', /json/);

                await api.post('/api/auth/register')
                .send({ name: 'testing', email: 'testing25@email.com', password: '' })
                .expect(400)
                .expect('Content-Type', /json/);

                await api.post('/api/auth/register')
                .send({ name: '', email: 'testing25@email.com', password: '12testing@Pl' })
                .expect(400)
                .expect('Content-Type', /json/);
            }
        ),
        test(
            'If the length email input is > 60 characters should return bad request.',
            async () =>
            {
                const note = await api.post('/api/auth/register')
                .send({ 
                    name: 'testing', 
                    email: 'testingtestiangtestingtestingtestingtestingtesting@testing.testing.com', 
                    password: '12testing@Pl' 
                });

                const limitCharactersPerMail = JSON.parse(note.text).details[0].context.limit;

                const messageError = JSON.parse(note.text).details[0].message;

                expect(note.status).toBe(400)
                expect(limitCharactersPerMail).toBe(60)
                expect(messageError).toContain('length must be less than or equal to 60 characters long')
            }
        ),
        test(
            'Password length must be >= 8 or less/equal to 60. Else bad request.',
            async () => 
            {
                await api.post('/api/auth/register')
                .send({ name: 'testing', email: 'testingtesting@email.com', password: '1234@AaB', gender: 'Non-Binarie' })
                .expect(200)

                const user = await api.post('/api/auth/register')
                .send({ name: 'testing', email: 'testingtesting@email.com', password: '1234@Aa' });

                const contextError = JSON.parse(user.text).details[0]['context'].key;

                expect(contextError).toBe('password');
                expect(user.status).toBe(400);

                await api.post('/api/auth/register')
                .send({ name: 'testing', email: 'testingtesting@email.com', password: '1234@AaB1234@AaB1234@AaB1234@AaB1234@AaB1234@AaB1234@AaB1234@AaB' })
                .expect(400);
            }
        ),
        test(
            'If name is < 4 and > 35 characters. Should return bad request.',
            async () =>
            {
                await api.post('/api/auth/register')
                .send({ name: 'tes', email: 'testingtesting@email.com', password: '1234@AaB' })
                .expect(400)
                .expect('Content-Type', /json/);
                
                await api.post('/api/auth/register')
                .send({ name: 'testestestestestestestestestestestes', email: 'testingtesting@email.com', password: '1234@AaB' })
                .expect(400)
                .expect('Content-Type', /json/);
            }
        ),
        test(
            'If name is < 4 and > 35 characters. Should return bad request.',
            async () =>
            {

            }
        )
    }
)

afterEach(
    async () => 
    {
        await closeServer();
    }
)