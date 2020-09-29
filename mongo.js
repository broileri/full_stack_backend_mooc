const mongoose = require('mongoose');

if (process.argv.length < 3) { // eslint-disable-line no-undef
  console.log('give password as argument');
  process.exit(1); // eslint-disable-line no-undef
}

const password = process.argv[2]; // eslint-disable-line no-undef
const url = `mongodb+srv://fullstack:${password}@kissafullstackmoocclust.a6yd6.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);


if (process.argv.length === 3) { // eslint-disable-line no-undef
  // Get all
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  // Save one
  const name = process.argv[3]; // eslint-disable-line no-undef
  const number = process.argv[4]; // eslint-disable-line no-undef

  const person = new Person({
    name,
    number
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}