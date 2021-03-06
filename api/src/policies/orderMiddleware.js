import Joi from 'joi';

class OrderMiddleware {
  validateAddToOrder(req, res, next) {
    try {
      const schema = {
        mealId: Joi.number()
          .min(1)
          .required(),
        quantity: Joi.number()
          .min(1)
          .required()
      };
      Joi.validate(req.body, schema);
      next();
      return true;
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: String(error.details[0].message),
        type: 'validation'
      });
    }
  }
  validateModifyOrder(req, res, next) {
    try {
      const schema = {
        action: Joi.string().required()
      };
      Joi.validate(req.body, schema);
      if (!['increase', 'decrease', 'delete'].includes(req.body.action)) {
        throw new Error('Invalid Action Requested');
      }
      next();
      return true;
    } catch (error) {
      let message;
      if (error.details !== undefined) {
        message = String(error.details[0].message);
      } else {
        message = String(error.message);
      }
      return res.status(400).json({
        status: false,
        message,
        type: 'validation'
      });
    }
  }

  validateOrdeCheckout(req, res, next) {
    try {
      const schema = {
        delivery_address: Joi.string().required()
      };
      Joi.validate(req.body, schema);
      next();
      return true;
    } catch (error) {
      let message;
      if (error.details !== undefined) {
        message = String(error.details[0].message);
      } else {
        message = String(error.message);
      }
      return res.status(400).json({
        status: false,
        message,
        type: 'validation'
      });
    }
  }
}

export default OrderMiddleware;
