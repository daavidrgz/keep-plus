require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://admin-david:' + process.env.DB_PASS + '@cluster0.gm6au.mongodb.net/notesDB', { useNewUrlParser: true });

const app = express();
app.use(require("body-parser").json());
app.use(cors());
const PORT = process.env.PORT || 3001;

const notesSchema = new mongoose.Schema({
	title: String,
	body: String,
	date: Date,
	fav: Boolean,
	bin: Boolean,
	category: String,
	color: String
});
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	notes: [notesSchema]
});
const Note = mongoose.model('Note', notesSchema);
const User = mongoose.model('User', userSchema);

app.get('/create', function(req, res) {
	const note = new Note({
		title: 'This is a test',
		body: 'Thiiiis iiis aaaaa teeeest, this isss a tesst, this is a test',
		date: new Date(),
		fav: false,
		bin: false,
		category: 'personal',
		color: '#eeb76b'
	});
	const user = new User({
		username: 'admin',
		email: 'admin@admin',
		password: 'admin',
		notes: [note]
	});

	user.save();
	res.send("Create OK");
});

app.post('/api/authenticate', function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if ( err || !user )
			res.status(404).json('Email not registered');
		else {
			if ( user.password !== req.body.password )
				res.status(404).json('Incorrect password');
			else
				res.status(200).send({email: user.email, username: user.username});
		}
	});
});

app.post('/api/get-notes', function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if ( err )
			console.error(err);
		else {
			const {bin, category} = req.body;
			let notes = user.notes.filter(note => (bin == null || note.bin == bin) && (category == 'all' || note.category == category));
			res.status(200).send(notes);
		}
	});
});

app.post('/api/update-note', function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if ( err )
			res.status(404).json('Wrong email');
			
		else {
			const newNotes = user.notes.map(note => {
				if ( note._id == req.body._id ) {
					note.title = req.body.title;
					note.body = req.body.body;
					note.date = new Date();
					note.category = req.body.category;
					note.bin = req.body.bin;
					note.fav = req.body.fav;
					note.color = req.body.color;
				}
				return note;
			});
			user.notes = newNotes;
			user.save();
			res.status(200).json('OK');
		}
	});
});

app.post('/api/add-note', function(req, res) {
	const newNote = new Note({
		title: req.body.title,
		body: req.body.body,
		data: new Date(),
		fav: false,
		bin: false,
		category: 'unset',
		color: req.body.color
	});

	User.findOne({email: req.body.email}, function(err, user) {
		if ( err )
			res.status(404).json('Wrong email');
		else {
			user.notes.push(newNote);
			user.save();
			res.status(200).json('OK');
		}
	});
});

app.post('/api/delete-note', function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if ( err )
			res.status(404).json('Wrong email');
		else {
			const newNotes = user.notes.filter(item => req.body._ids.every(id => item._id != id));
			user.notes = newNotes;
			user.save();
			res.status(200).json('OK');
		}
	});
});

app.listen(PORT, () =>
	console.log(`Server listening on port: ${PORT}`)
);
