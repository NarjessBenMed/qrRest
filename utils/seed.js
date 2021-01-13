const bcrypt = require('bcrypt');
const User = require('../models/user');
const username = process.env.admin;
const password = process.env.password;

const createAdmin = async () => {
  try {
    const existedAdmin = await User.findOne({ username });
    if (!existedAdmin) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        password: hashedPassword,
        role: 'admin',
      });
      await user.save();
      console.log('admin created');
    }
    console.log('admin already exist');
  } catch (error) {
    console.log(error);
  }
};

module.exports = createAdmin;
