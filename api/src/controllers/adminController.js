import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/admin';
import secret from '../util/jwt';

class AdminControllers {
  async registerAdmin(req, res) {
    try {
      const { name, email, phone, password } = req.body;
      const hash = await bcrypt.hash(password, 8);
      const admin = await Admin.create({
        name,
        email,
        phone,
        password: hash
      });
      const ordinaryAdmin = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone
      };
      const ONE_WEEK = 60 * 60 * 24 * 7;
      const jwtTokenKey = await jwt.sign(
        {
          admin: ordinaryAdmin,
          isAdmin: true
        },
        secret,
        {
          expiresIn: ONE_WEEK
        }
      );
      return res.status(201).json({
        status: 'success ',
        message: 'Register Successfully',
        token: `Bearer ${jwtTokenKey}`,
        admin: ordinaryAdmin
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error geting token',
        message: error.message
      });
    }
  }
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        throw new Error('Admin with that email does not macth our record or exist');
      }
      const result = await bcrypt.compare(password, caterer.password);
      if (!result) {
        throw new Error('Log In Information does not match our records');
      }
      const ordinaryAdmin = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone
      };
      const ONE_WEEK = 60 * 60 * 24 * 7;
      const jwtTokenKey = await jwt.sign(
        {
          admin: ordinaryAdmin,
          isAdmin: true
        },
        secret,
        {
          expiresIn: ONE_WEEK
        }
      );
      return res.status(200).json({
        status: 'success',
        message: 'Welcome admin, Logged In Successfully',
        token: `Bearer ${jwtTokenKey}`,
        user: ordinaryAdmin
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

const AdminController = new AdminControllers();
export default AdminController;
