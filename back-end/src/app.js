// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

dotenv.config();

// routes
const mainRoutes = require('./routes');
const userRoutes = require('./routes/userRoutes');
const novelRoutes= require('./routes/novelRoutes');
const genreRoutes= require('./routes/genreRoutes');
const novelGenreRoutes= require('./routes/novelGenreRoutes');
const chapterRoutes= require('./routes/chapterRoutes');
const commentRoutes= require('./routes/commentRoutes');
const authRoutes= require('./routes/authRoutes');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Gunakan process.cwd() agar Express pakai path root project, bukan src/
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Gunakan route
app.use('/api', mainRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/novel', novelRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api', novelGenreRoutes);
app.use('/api', chapterRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/auth', authRoutes);



// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Project Novel API');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
