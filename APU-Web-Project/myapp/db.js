const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'learning_platform',
});

db.connect((err) => {
    if(err) {
        console.error('Database connection failede:', err);
    }else{
        console.log('Connected to the database')
    }
});

