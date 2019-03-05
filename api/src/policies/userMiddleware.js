import Joi from 'joi';

class UsersMiddleware {
  async validateRegister(req, res, next) {
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
    const { error } = await Joi.validate(req.body, schema);
    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email address'
          });
          break;
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
              <br>
              1. It must contain ONLY the following characters: lower case, upper case, numerics.
              <br>
              2. It must be at least 8 characters in length and not greater than 32 characters in length.
            `
          });
          break;
        default:
          res.status(400).send({
            error: 'Invalid registration information'
          });
      }
    } else {
      next();
      return true;
    }
  }

  async validateLogin(req, res, next) {
    const schema = {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(new RegExp('^[a-zA-Z0-9]{8,32}$'))
        .required()
    };
    const { error } = await Joi.validate(req.body, schema);
    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email address'
          });
          break;
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
              <br>
              1. It must contain ONLY the following characters: lower case, upper case, numerics.
              <br>
              2. It must be at least 8 characters in length and not greater than 32 characters in length.
            `
          });
          break;
        default:
          res.status(400).send({
            error: 'Invalid Login information'
          });
      }
    } else {
      next();
      return true;
    }
  }
}

const UserMiddleware = new UsersMiddleware();
export default UserMiddleware;
