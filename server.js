const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
const pg = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres',
    database : 'smartbrain'
  }
});

db.select('*').from('users').then(data => {console.log(data);});


app.use(express.json());
app.use(cors());

const database = {
	users: [
		{	id: '123',
			name: 'john',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{	id: '124',
			name: 'sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	console.log('req body', req.body);
	console.log('email', req.body.email);
	console.log('password', req.body.password);
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const {name, email, password} = req.body;
	db('users')
	.returning('*')
	.insert({
		name:name,
		email: email,
		joined: new Date
	})
	.then(resp => res.json(resp))
	.catch(err => res.json(err));
})

app.get('/profile/:id', (req, res) => {
	const id = req.params.id;
	let foundUser = false;
	database.users.forEach(user => {
		if (user.id === id) {
			foundUser = true;
			return res.json(user);
		}
	})
	if (!foundUser) {
		res.json('User not found!');
	}
})

app.put('/image', (req, res) => {
	const id = req.body.id;
	let foundUser = false;
	database.users.forEach(user => {
		if (user.id === id) {
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!foundUser) {
		res.json('User not found!');
	}
})

app.listen(3000, ()=>{
	console.log("app is running on port 3000");
})