import express from 'express';
import bcrypt from 'bcryptjs';
import supabase from './supabase.js';

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, number, password } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([{ firstname, lastname, email, number, password_hash: hashedPassword }])
            .select();

        if (error) throw error;

        res.status(201).json({ user: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
