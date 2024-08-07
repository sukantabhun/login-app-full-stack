import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();


app.use(cors({
  origin: 'https://login-app-full-stack-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = 'mongodb+srv://sukantabhun:A466kalkaji@cluster0.hmzywij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGOURL).then(() => {
  console.log("Database connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => console.log(error));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('users', userSchema);

app.use(express.json());


app.options('*', cors());

app.get('/', (req, res) => {
  res.json('hello');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Name, email, and password are required');
  }

  const user = new User({ name, email, password });

  try {
    await user.save();
    res.status(200).send('User registered successfully');
  } catch (error) {
    res.status(500).send("User registration unsuccessful");
  }
});

app.post('/login/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const dbUser = await User.findOne({ email });

  if (!dbUser) {
    return res.status(400).send('Invalid user');
  }

  const isPasswordMatched = (password === dbUser.password);

  if (!isPasswordMatched) {
    return res.status(400).send('Invalid password');
  }

  const payload = { email };
  const jwtToken = jwt.sign(payload, 'your_jwt_secret');
  res.send({ jwtToken, name: dbUser.name });
});
