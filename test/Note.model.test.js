const supertest = require('supertest');
const app = require('../src/server.js');
const { test } = require('@jest/globals');
const api = supertest(app);
const {Note} = require('../src/models/Note.schema.js');
const { openServer, closeServer, mongodb } = require('../src/helpers/utils.js');
const { User } = require('../src/models/User.schema.js');


beforeEach(async () => {
    await openServer();

    const user = new User({ name: 'testing', email: 'testing12@email.com', password: '12testing@Pl', gender: 'Male' });
    await user.save();

    const note = new Note({ note: 'Buy eggs for breakfast.', userId: user._id });
    await note.save();
});

describe('Note model and routes.', () => {
    test(
        'Notes are returned as json.',
        async () => {
            await api.get('/api/notes')
            .expect(200)
            .expect('Content-Type', /json/);
        }
    ),
    test(
        'Note posted successfully with 200 Http code. ',
        async () => {
            await api.post('/api/notes/add')
            .send({ note: 'Buy eggs for breakfast.' , userId:'adsgakgag'})
            .expect(200)
            .expect('Content-Type', /json/);
        }
    )
    test(
        '400 if new note length === 0 .',
        async () => {
            await api.post('/api/notes/add')
            .send({ note: '', userId: '21828131' })
            .expect(400)
            .expect('Content-Type', /json/);
        }
    )
    test(
        'Note must be an string. else return 400',
        async () =>
        {
            await api.post(`/api/notes/add`)
            .send({
                note: 1,
                userId: '032434'
            })
            .expect(400)
        }
    ),
    test(
        'If the object note dont have property note. return error 400',
        async () =>
        {
            const note =
            {
                email: ""
            };
            const noteEmpty = {};

            await api.post(`/api/notes/add`)
            .send(note)
            .expect(400);

            await api.post('/api/notes/add')
            .send(noteEmpty)
            .expect(400);
        }
    ),
    test(
        'Delete request should return 200',
        async () =>
        {
            const notes = await api.get('/api/notes')

            const deletedNote = await api.delete(`/api/notes/${JSON.parse(notes.text).response[0]['_id']}`)

            expect(deletedNote.status).toBe(200)
            expect(deletedNote.type).toBe('application/json');
        }
    )
});

afterEach(async () => {
    await closeServer();
});