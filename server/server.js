require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-find-or-create');
const path = require('path');

const app = express();
app.use('/static', express.static(__dirname + '/../build/static'));
app.use(require("body-parser").json());
app.use(cors());
app.use(session({
	secret: process.env.SESSION,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}));
app.use(passport.initialize());
app.use(passport.session());

const HOST = process.env.HOST || 'localhost';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notesDB';

mongoose.set('useUnifiedTopology', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false });
mongoose.set('useCreateIndex', true);

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
	name: String,
	email: String,
	password: String,
	googleId: String,
	picture: String,
	notes: [notesSchema]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Note = mongoose.model('Note', notesSchema);
const User = mongoose.model('User', userSchema);

passport.serializeUser(function (user, done) {
	done(null, user._id);
});
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(User.createStrategy());

passport.use(new GoogleStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: `https://${HOST}/auth/google/main`,
},
	function (accessToken, refreshToken, profile, cb) {
		let { email, picture, name, sub: googleId } = profile._json;
		User.findOrCreate({ googleId: googleId }, { googleId: googleId, email: email, picture: picture, name: name }, function (err, user) {
			return cb(err, user);
		});
	}
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/main', passport.authenticate('google'), function (req, res) {
	res.redirect("/");
});

app.get('/api/get-user', function (req, res) {
	if (req.isAuthenticated())
		res.send({
			email: req.user.email,
			picture: req.user.picture,
			name: req.user.name,
		});
	else
		res.send({ email: "no user" });
});

app.get('/api/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/api/authenticate', function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err || !user || !user.password)
			res.status(404).json('Email not registered');
		else {
			if (user.password !== req.body.password)
				res.status(404).json('Incorrect password');
			else
				res.status(200).send({ email: user.email, name: user.name, picture: user.picture });
		}
	});
});

app.post('/api/get-notes', function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err)
			console.error(err);
		else {
			const { bin, category } = req.body;
			let notes = user.notes.filter(note => (bin == null || note.bin === bin) && (category === 'all' || note.category === category));
			res.status(200).send(notes);
		}
	});
});

app.post('/api/update-note', function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err)
			res.status(404).json('Wrong email');

		else {
			const newNotes = user.notes.map(note => {
				if (note._id == req.body._id) {
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

app.post('/api/add-note', function (req, res) {
	const newNote = new Note({
		title: req.body.title,
		body: req.body.body,
		data: new Date(),
		fav: false,
		bin: false,
		category: req.body.category,
		color: req.body.color
	});

	User.findOne({ email: req.body.email }, function (err, user) {
		if (err)
			res.status(404).json('Wrong email');
		else {
			user.notes.push(newNote);
			user.save();
			res.status(200).json('OK');
		}
	});
});

app.post('/api/delete-note', function (req, res) {
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err)
			res.status(404).json('Wrong email');
		else {
			const newNotes = user.notes.filter(note => !req.body._ids.some(id => id == note._id));
			user.notes = newNotes;
			user.save();
			res.status(200).json('OK');
		}
	});
});

app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});
app.get('/style.css', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../build/style.css'));
});
app.get('/uicons-regular-straight.css', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../build/uicons-regular-straight.css'))
})
app.get('/uicons-regular-straight.woff2', function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../build/uicons-regular-straight.woff2'))
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
	console.log(`Server listening on port: ${PORT}`)
);
