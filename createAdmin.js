const { Admin } = require('./models');

async function create() {
  await Admin.create({
    username: 'admin',
    password: 'admin123'
  });
  console.log('Admin created!');
  console.log('Username: admin');
  console.log('Password: admin123');
}

create().catch(console.error);