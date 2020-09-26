const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

/* ========== Creating the app ========== */
const app = express();

/* ========== Parsing request body as JSON ========== */
app.use(express.json());

/* ========== Logging ========== */
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

/* ========== CORS settings ========== */
app.use(cors());

/* ========== Display front end ========== */
app.use(express.static('build'));



/* ========== "Database" :D ========== */
let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122',
    },
];

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info of ${persons.length} persons</p><p></p>${new Date().toString()}</p>`);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id, 10);
    const person = persons.find(note => note.id === id);

    if (!person) {
        return response.sendStatus(404);
    }

    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    console.log('Persons after delete', persons);

    response.sendStatus(204);
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.name.length) {
        return response.status(400).json({ error: 'Missing value: name' });
    }

    if (!body.number || !body.number.length) {
        return response.status(400).json({ error: 'Missing value: number' });
    }

    if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({ error: 'The following value must be unique: name' });
    }

    const person = {
        id: Math.floor(Math.random() * Math.floor(9999999999999999999)),
        name: body.name,
        number: body.number || '',
    };

    persons = persons.concat(person);
    response.json(person);
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});