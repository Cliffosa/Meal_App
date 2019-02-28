import meals from '../models/meals';

class mealsController {
  // method to get all meals
  getAllMeals(req, res) {
    return res.status(200).send({
      success: true,
      message: 'meals retrieved successfully',
      meals: meals
    });
  }

  // get a single meal
  getMeal(req, res) {
    let found = false;
    const id = parseInt(req.params.id, 10);
    meals.map(meal => {
      if (meal.id === id) {
        found = true;
        return res.status(200).send({
          success: true,
          message: 'meal retrieved successfully',
          meal
        });
      }
    });
    if (!found) {
      return res.status(404).send({
        success: false,
        message: 'meal does not exist'
      });
    }
    // check for invalid meal id and return false
  }

  // create a meal
  createMeal(req, res) {
    // validate body
    if (!req.body.name) {
      return res.status(400).send({
        success: false,
        message: 'name is required'
      });
    } else if (!req.body.quantity) {
      return res.status(400).send({
        success: false,
        message: 'quantity is required'
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: false,
        message: 'price is required'
      });
    }
    const meal = {
      id: meals.length + 1,
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price
    };
    meals.push(meal);
    return res.status(201).send({
      success: true,
      message: 'meal added successfully',
      meal
    });
  }

  // update a meal
  updateMeal(req, res) {
    const id = parseInt(req.params.id, 10);
    let mealFound;
    let itemIndex;
    meals.map((meal, index) => {
      if (meal.id === id) {
        mealFound = meal;
        itemIndex = index;
      }
    });

    if (!mealFound) {
      return res.status(404).send({
        success: false,
        message: 'meal not found'
      });
    }
    // validate body
    if (!req.body.name) {
      return res.status(400).send({
        success: false,
        message: 'name is required'
      });
    } else if (!req.body.quantity) {
      return res.status(400).send({
        success: false,
        message: 'quantity is required'
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'price is required'
      });
    }
    const newMeal = {
      id: mealFound.id,
      name: req.body.name || mealFound.name,
      quantity: req.body.quantity || mealFound.quantity,
      price: req.body.price || mealFound.price
    };
    meals.splice(itemIndex, 1, newMeal);
    return res.status(201).send({
      success: true,
      message: 'meal updated successfully',
      newMeal
    });
  }

  // delete a meal
  deleteMeal(req, res) {
    const id = parseInt(req.params.id, 10);
    let mealFound;
    let itemIndex;
    meals.map((meal, index) => {
      if (meal.id === id) {
        mealFound = meal;
        itemIndex = index;
      }
    });

    if (!mealFound) {
      return res.status(404).send({
        success: false,
        message: 'meal not found'
      });
    }
    meals.splice(itemIndex, 1);

    return res.status(200).send({
      success: true,
      message: 'meal deleted successfuly'
    });
  }
}

// create an instance of the class and export it
const mealController = new mealsController();
export default mealController;
