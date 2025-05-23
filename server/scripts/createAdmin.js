const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'tea_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Create initial admin with encrypted password
    const adminEmail = 'admin@neuroeval.com';
    const adminPassword = 'admin123';
    const adminName = 'Administrador';
    const adminLastName = 'Principal';

    // Hash the password
    bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        // Insert admin into database
        const query = 'INSERT INTO Administrador (Nombre, Apellido, Email, Contrasena) VALUES (?, ?, ?, ?)';
        db.query(query, [adminName, adminLastName, adminEmail, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error inserting admin:', err);
                return;
            }

            console.log('Admin created successfully!');
            console.log('Credentials:');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
            console.log('Please change these credentials after first login!');

            // Close database connection
            db.end();
        });
    });
});
