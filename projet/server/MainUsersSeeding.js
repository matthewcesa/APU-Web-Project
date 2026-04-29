const bcrypt = require('bcryptjs')
const db = require('./db')

async function seedUsers() {
  try {
    const password = 'testpassword'
    const passwordHash = await bcrypt.hash(password, 10)

    const users = [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@test.com',
        password_hash: passwordHash,
        role: 'admin',
        status: 'active',
      },
      {
        first_name: 'Teacher',
        last_name: 'User',
        email: 'teacher@test.com',
        password_hash: passwordHash,
        role: 'teacher',
        status: 'active',
      },
      {
        first_name: 'Student',
        last_name: 'User',
        email: 'student@test.com',
        password_hash: passwordHash,
        role: 'student',
        status: 'active',
      },
    ]

    for (const user of users) {
      db.query(
        `
        INSERT INTO Users 
        (first_name, last_name, email, password_hash, role, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          first_name = VALUES(first_name),
          last_name = VALUES(last_name),
          password_hash = VALUES(password_hash),
          role = VALUES(role),
          status = VALUES(status)
        `,
        [
          user.first_name,
          user.last_name,
          user.email,
          user.password_hash,
          user.role,
          user.status,
        ],
        (err) => {
          if (err) {
            console.error(err)
          }
        }
      )
    }

    console.log('Default users created/updated.')
    console.log('Emails:')
    console.log('admin@test.com')
    console.log('teacher@test.com')
    console.log('student@test.com')

    setTimeout(() => {
      db.end()
    }, 500)
  } catch (error) {
    console.error(error)
    db.end()
  }
}

seedUsers()