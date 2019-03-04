import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import secret from '../util/jwt';

class UserController {
  registerUser(req, res) {
    try {
      const { name, email, phone, password } = req.body;
      const hash = bcrypt.hash(password, 8);
      //pass the hashed password
      const user = User.create({ name, email, phone, password: hash });
      //declare user without password
      const ordinaryUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      };

      //create token and its expiration
      const ONE_WEEK = 60 * 60 * 24 * 7;
      const jwtTokenkey = jwt.sign({ user: ordinaryUser }, secret, {
        expiresIn: ONE_WEEK
      });
      return res.status(201).json({
        status: 'success',
        message: 'User Registered Successfully',
        token: `Bearer ${jwtTokenkey}`,
        user: ordinaryUser
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  }

  loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = User.findOne({ where: { email } });
      //check if user exist
      if (!user) {
        throw new Error('User with that email does not exist');
      }
      //compare password
      const result = bcrypt.compare(password, user.password);
      if (!result) {
        throw new Error('login information does not match our records');
      }
      //otherwise register user
      const ordinaryUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      };
      //create token and its expiration
      const ONE_WEEK = 60 * 60 * 24 * 7;
      const jwtTokenkey = jwt.sign({ user: ordinaryUser }, secret, {
        expiresIn: ONE_WEEK
      });
      return res.status(200).json({
        status: 'success',
        message: 'Login Successfully',
        token: `Bearer ${jwtTokenkey}`,
        user: ordinaryUser
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  }
}

export default UserController;
