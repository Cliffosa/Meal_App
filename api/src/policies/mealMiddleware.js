import Joi from 'joi';

class MealsMiddleware {
  async validateAddMealToMenu(req, res, next) {
    try {
      const schema = {
        mealId: Joi.number().required(),
        quantity: Joi.number()
          .min(1)
          .required()
      };
      await Joi.validate(req.body, schema);
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

  async validateAddMeal(req, res, next) {
    try {
      const schema = {
        name: Joi.string().required(),
        price: Joi.number()
          .min(1)
          .required()
      };
      await Joi.validate(req.body, schema);
      if (rq.files === null) {
        throw new Error(`Meal Image Is Required!`);
      }
      const allowedImages = ['image/jpg', 'image/png', 'image/jpeg'];
      if (!allowedImages.includes(req.files.image.mimetype)) {
        throw new Error('Only JPG, JPEG & PNG Images are allowed');
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

  async validateUpdateMeal(req, res, next) {
    try {
      const schema = {
        name: Joi.string().required(),
        price: Joi.number()
          .min(1)
          .required()
      };
      await Joi.validate(req.body, schema);
      if (req.files !== null) {
        const allowedImages = ['image/jpg', 'image/png', 'image/jpeg'];
        if (!allowedImages.includes(req.files.image.mimetype)) {
          throw new Error('Only JPG, JPEG & PNG Images are allowed');
        }
      }
      next();
      return true;
    } catch (error) {
      let message;
      if (error.details !== undefined) {
        message = String(erroreerrorrr.details[0].message);
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

const MealMiddleware = new MealsMiddleware();
export default MealMiddleware;
