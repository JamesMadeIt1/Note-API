const UserModel = require('./models/user.model.js');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const generateToken = require('./utils/generateToken.js');
const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});
     

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name, email } });
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

try {
    exports.login = async (req, res, next) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user ||!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email } });
    };
} catch (error) {
    {next(error)

    };

    module.exports = { register, login };