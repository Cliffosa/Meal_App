import Joi from 'joi';
import UserMiddleware from './userMiddleware';

class AdminMiddleware extends UserMiddleware {
  validateRegister(req, res, next) {
    try {
      const schema = {
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        phone: Joi.number()
          .min(11)
          .required(),
        password: Joi.string()
          .regex(new RegExp('^[a-zA-Z0-9]{8,32}$'))
          .required()
      };
      Joi.validate(req.body, schema);
      next();
      return true;
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: String(error.details[0].message),
        type: 'validation'
      });
    }
  }
}

export default AdminMiddleware;
