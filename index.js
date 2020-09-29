const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const errorHandler = require('./middlewares/errorHandler');

/* ========== Creating the app ========== */
const app = express();

/* ========== Parsing request body as JSON ========== */
app.use(express.json());

/* ========== Logging ========== */
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

/* ========== CORS settings ========== */
app.use(cors());

/* ========== Display front end ========== */
app.use(express.static('build'));

/* =========== Routes & controllers ========== */
app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`<p>Phonebook has info of ${result.length} persons</p><p></p>${new Date().toString()}</p>`);
    });
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.name.length) {
        return response.status(400).json({error: 'Missing value: name'});
    }

    if (!body.number || !body.number.length) {
        return response.status(400).json({error: 'Missing value: number'});
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;
    const id = request.params.id;

    const person = {
        name: body.name,
        number: body.number,
    };

    // Validators do not work on findByIdAndUpdate - whoops!
    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

/* =========== Error handling ========== */
app.use(errorHandler);

/* =========== Starting the server ========== */
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});