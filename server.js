const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const methodOverride = require('method-override');

const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Allows method for delete and put
const SECRETKEY = 'key123';
app.use(session({
    name: 'session',
    keys: [SECRETKEY],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Connect to MongoDB
const uri = 'mongodb+srv://s1350838:23746933@cluster0.cs5fy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schema 
const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique:true },
    password: { type: String, required: true},
    
});

const Transaction = mongoose.model('Transaction', transactionSchema);

const User = mongoose.model('users', userSchema);

// User authentication 
app.get('/', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/login');
    } else {
        res.redirect('/transactions');
    }
});

app.get('/register', (req, res) => {
    res.status(201).render('register', { error: null });
});

app.get('/login', (req, res) => {
    res.status(200).render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    try {
        //finding user
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).render('login', { error: 'Invalid username or password' });
        }

        req.session.authenticated = true;
        req.session.username = username;

        res.redirect('/transactions'); 
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('login', { error: 'Invalid username or password' });
    }
});
    

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        //check exist or not
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render('register', { error: 'Username already exists' });
        }

        //save to database
        const newUser = new User({ username, password });
        await newUser.save();

        res.redirect('/login'); 
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('register', { error: 'Registration failed. Please try again later.' });
    }
});


app.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/login');
});

// Read transactions
app.get('/transactions', async (req, res) => {
    if (!req.session.authenticated) {
        return res.redirect('/login');
    }

    const query = req.query.query || '';
    const transactions = await Transaction.find({
        $or: [
            { description: new RegExp(query, 'i') },
            { type: new RegExp(query, 'i') },
            { amount: query ? Number(query) : { $exists: true } }
        ]
    });

    res.render('transactions', { transactions, username: req.session.username });
});

// Create transaction
app.post('/transactions', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.redirect('/transactions'); 
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(400).send('Error creating transaction: ' + error.message); 
    }
});

// Update transaction
app.put('/transactions/:id', async (req, res) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTransaction) return res.status(404).send('Transaction not found');
    res.redirect('/transactions'); 
});

// Delete transaction
app.delete('/transactions/:id', async (req, res) => {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) return res.status(404).send('Transaction not found');
    res.redirect('/transactions'); 
});

// RESTful APIs for transactions
app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions); 
});

app.post('/api/transactions', async (req, res) => {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction); 
});

app.put('/api/transactions/:id', async (req, res) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTransaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updatedTransaction); 
});

app.delete('/api/transactions/:id', async (req, res) => {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) return res.status(404).json({ error: 'Transaction not found' });
    res.status(204).send(); 
});

const server = app.listen(process.env.PORT || 8099, () => {
  const port = server.address().port;
  console.log(`Server listening at port ${port}`);
});
