const pool= require('../config/db');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const dotenv= require('dotenv');

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, konfirmasiPassword } = req.body;

    // Validasi input
    if (!username || !email || !password || !konfirmasiPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Cek password sama
    if (password !== konfirmasiPassword) {
      return res.status(400).json({ error: 'Password confirmation does not match' });
    }

    // Cek apakah username/email sudah digunakan
    const existing = await pool.query(
      `SELECT * FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const result = await pool.query(
      `
        INSERT INTO users (username, email, password, role, avatar_url)
        VALUES ($1, $2, $3, 'reader', null)
        RETURNING id, username, email, role, created_at;
      `,
      [username, email, hashedPassword]
    );

    const user = result.rows[0];

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered and logged in successfully',
      tokenJWT: token,
      data: user,
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


const loginUser= async (req, res)=> {
    try {
        const {username, password}= req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        // cek username
        const result= await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        if(result.rowCount == 0){
            return res.status(401).json({error: "Username or password is wrong!"});
        }
        const user= result.rows[0];

        // password
        const valid= await bcrypt.compare(password, user.password);
        if(!valid){
            return res.status(401).json({error: "Username or password is wrong!"})
        }

        // console.log('JWT_SECRET:', process.env.JWT_SECRET);


        // buat token JWT
        const token= jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1d'} // berlaku 1 hari
        );

        res.status(200).json({
            message: 'Login successfully',
            tokenJWT: token,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
}


module.exports= {
    registerUser,
    loginUser
}