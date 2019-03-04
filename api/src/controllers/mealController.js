import fs from 'fs';
import Meal from '../models/meals';

class mealsController {
  createMeal(req, res) {
    try {
      const { name, price } = req.body;
      const { image } = req.files;
      const imageUrl = `/api/src/images/${image.name}`;
      const meal = Meal.create({ name, price, imageUrl, adminId: req.admin.id });
      image.mv(`.${imageUrl}`);
      return res.status(201).json({
        status: true,
        message: 'Meal Added Successfully',
        addedMeal: {
          id: meal.id,
          name: meal.name,
          price: meal.price,
          imageUrl: meal.imageUrl
        }
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
  }

  getAllMeals(req, res) {
    try {
      const meals = Meal.findAll({ where: { adminId: req.admin.id } });
      return res.status(200).json({
        status: true,
        message: 'Meals Retrieved Successfully!',
        fetchData: meals
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: 'Failed to fetch Meals'
      });
    }
  }

  // getMeal(req, res) {
  //   let found = false;
  //   const id = parseInt(req.params.id, 10);
  //   meals.map(meal => {
  //     if (meal.id === id) {
  //       found = true;
  //       return res.status(200).send({
  //         success: true,
  //         message: 'meal retrieved successfully',
  //         meal
  //       });
  //     }
  //   });
  //   if (!found) {
  //     return res.status(404).send({
  //       success: false,
  //       message: 'meal does not exist'
  //     });
  //   }
  // }

  updateMeal(req, res) {
    try {
      const meal = Meal.findOne({ where: { id: req.params.id } });
      if (!meal) {
        throw new Error(`Meal with ID ${req.params.id} does not exist, please try another ID`);
      }
      let name, price;
      if (req.body.name) {
        name = req.body.name;
      } else {
        name = meal.name;
      }

      if (req.body.name) {
        price = req.body.price;
      } else {
        price = meal.name;
      }

      const mealUpdate = {
        name,
        price
      };
      if (req.files !== null) {
        const { image } = req.files;
        const imageUrl = `/api/src/images/${image.name}`;
        fs.unlink(`.${meal.imageUrl}`, error => {
          if (error) throw new Error(error.message);
        });
        mealUpdate.imageUrl = imageUrl;
        image.mv(`.${imageUrl}`);
      } else {
        mealUpdate.imageUrl = meal.imageUrl;
      }
      const { name, price, imageUrl } = mealUpdate;
      Meal.update({ name, price, imageUrl }, { where: { id: req.params.id } });
      return res.status(200).json({
        status: true,
        message: 'Meal Updated Successfully!'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: `Update was Unsuccessfull!`
      });
    }
  }

  deleteMeal(req, res) {
    try {
      const { id } = req.params;
      const meal = Meal.findOne({ where: { id: id } });
      fs.unlink(`.${meal.imageUrl}`, error => {
        if (error) throw new Error(error.message);
      });
      meal.destroy();
      return res.status(200).json({
        status: true,
        message: 'Meal Deleted Successfully!'
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Meal with that ${req.params.id} was unable to be deleted`
      });
    }
  }
}
const mealController = new mealsController();
export default mealController;
