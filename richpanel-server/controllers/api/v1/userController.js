const User = require('../../../models/User');
const generateToken = require('../../../utils/jwt');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new student
    user = new User({ name, email, password: hashedPassword });

    await user.save();

    res.status(200).json({ msg: 'User registered successfully' });

  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'U Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'P Invalid credentials' });
    }

    const token = await generateToken(user.id);

    // remove sensitive data before sending student object
    user.password = undefined;

    // include the student object in the response
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  // Invalidate the token
  res.json({ msg: "Logged out" });
};