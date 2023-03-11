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
   const user = new User({ name: 'testing', email: 'testing12@email.com', password: '12testing@Pl', gender: 'Male' });
   await user.save();
});

describe(
    'Auth controller.',
    () => 
    {
        test(
            'If the password length < 8 GET Bad Request.', 
            async () => 
            {
                const newUser = 
                {
                    name: 'kaja',
                    email: 'kaj@gmail.com',
                    password: '1234',
                    gender: 'Non-Binarie'
                };

                const {text} = await api.post('/api/auth/register')
                .send(newUser);

                const contextError = JSON.parse(text).details[0].context.key;
                const messageError = JSON.parse(text).details[0].message;

                expect(contextError).toBe('password');
                expect(messageError).toBe('\"password\" length must be at least 8 characters long');
            }
        ),
        test(
            'If the password length >= 8 but doesnt have 1 upper letter case, 1 lower case, 1 digit and 1 special character, then should get bad request.', 
            async () => 
            {
                const newUser = 
                {
                    name: 'kaja',
                    email: 'kaj@gmail.com',
                    password: '12345678',
                    gender: 'Non-Binarie'
                };
                
                const {text} = await api.post('/api/auth/register')
                .send(newUser);

                const { status, message, success } = JSON.parse(text);

                expect(success).toBe(false);
                expect(status).toBe(400);
                expect(message).toBe(
                    'The password is at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character.'
                );
            }
        ),
        test(
            'Joi should send a message = \password\ is required if the user doesnt type anything', 
            async () => 
            {
                const newUser = 
                {
                    name: 'kaja',
                    email: 'kaj@gmail.com',
                    password: ''
                };
        
                const {text} = await api.post('/api/auth/register')
                .send(newUser)

                const contextError = JSON.parse(text).details[0].context.key;
                const messageError = JSON.parse(text).details[0].message;

                expect(contextError).toBe('password');
                expect(messageError).toBe('\"password\" is required');
            }
        ),
        test(
            'Get bad request if user wants to be logged but is null in data base',
            async () =>
            {
                const user =
                {
                    email: 'te@gmail.com',
                    password: '2424455%sj',
                    gender: 'Non-Binarie'
                };
        
                const {text} = await api.post('/api/auth/login')
                .send(user);
        
                const { status, message } = JSON.parse(text);
            
                expect(status).toBe(404);
                expect(message).toBe('USER_UNKNOW');
            }
        ),
        test(
            'Get bad request if password or email is falsy.',
            async ()=>
            {
                const arr = 
                [
                    {
                        email: 'test@gmail.com',
                        password: '',
                        gender: 'Non-Binarie'
                    },
                    {
                        email: '',
                        password: '12357@Ah92',
                        gender: 'Non-Binarie'
                    }
                ];
        
                let i = arr.length;
        
                while ( i -- > 0 )
                {
                    const {text} = await api.post('/api/auth/login')
                    .send(arr[i]);

                    const { status, message } = JSON.parse(text);
            
                    expect(status).toBe(401);
                    expect(message).toBe('INSERT_CREDENTIALS');
                }
            }
        ),
        test(
            'Bad request if the email exists in db and he`s trying register. else good request.',
            async () => 
            {
                await api.post('/api/auth/register')
                .send({ name: 'pedro', email: 'testing12@email.com', password: '12testing@Pl', gender: 'Male' })
                .expect(404)
                .expect('Content-Type', /json/);

                await api.post('/api/auth/register')
                .send({ name: 'testing', email: 'thisemailisnullindatabase@email.com', password: '12testing@Pl', gender: 'Female' })
                .expect(200)
                .expect('Content-Type', /json/);
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