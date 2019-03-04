import jwt from 'jsonwebtoken';
import secret from '../util/jwt';

class AuthController {
  async verifyUserTokenKey(req, res, next) {
    //check and get if token is provided from the header
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: 'error getting token',
        message: 'No Token Provided'
      });
    }
    // get the second index of the token
    const jwtTokenKey = token.split(' ')[1];
    try {
      const decodedToken = await jwt.verify(jwtTokenKey, secret);
      req.user = decodedToken.user;
      next();
      return true;
    } catch (err) {
      return res.status(401).json({
        status: 'error getting token',
        message: 'Invalid Authentication Token'
      });
    }
  }

  async verifyAdminTokenKey(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: 'error getting token',
        message: 'No Token Provided'
      });
    }
    const jwtTokenKey = token.split(' ')[1];
    try {
      const decodedToken = await jwt.verify(jwtTokenKey, secret);
      //check isAdmin
      if (!decodedToken.isAdmin) {
        throw new Error('Access Denied');
      }
      req.admin = decodedToken.admin;
      next();
      return true;
    } catch (err) {
      return res.status(401).json({
        status: 'error getting token',
        message: 'Access Denied'
      });
    }
  }
}

export default AuthController;
