import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = 'mongodb+srv://sukantabhun:A466kalkaji@cluster0.hmzywij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGOURL).then(() => {
  console.log("database connection successfully")
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => console.log(error))

const userSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
  },
  email: {
    type:String,
    required:true,
    unique:true,
  },
  password: {
    type:String,
    required:true,
  },
});

const User = mongoose.model('users', userSchema);

app.use(express.json());
app.use(cors());


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Name, email, and password are required');
  }
  
  
  const user = new User({ name, email, password});
  
  try {
    await user.save();
    res.status(200).send('User registered successfully');
  } catch (error) {
    res.status(500).send("User registration unsuccessful");
  }
});


app.post('/login/', async (request, response) => {
  const {email, password} = request.body

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const dbUser = await User.findOne({ email });

  if (!dbUser) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = (password === dbUser.password)
    if (!isPasswordMatched) {
      response.status(400)
      response.send('Invalid password')
    } else {
      const payload = {email}
      const jwtToken = jwt.sign(payload, 'your_jwt_secret')
      response.send({jwtToken, name:dbUser.name})
    }
  }
})
