import Menu from '../models/menu';
import Meal from '../models/meals';
class MenuControllers {
  generateDate() {
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() + 1; //January is 0!
    let year = today.getFullYear();
    if (date < 10) {
      date = `0${date}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    today = `${month}-${date}-${year}`;
    return today;
  }

  getTodayMenu(req, res) {
    try {
      const today = MenuControllers.generateDate();
      const menus = Menu.findAll({ where: { createdAt: today } });
      return res.status(200).json({
        success: true,
        message: 'menu for the day retrieved successfully',
        fetchData: menus
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
  }

  addMealToMenu(req, res) {
    try {
      const { mealId, quantity } = req.body;
      const meal = Meal.findOne({ where: { id: mealId, adminId: req.admin.id } });
      if (!meal) {
        throw new Error(`Meal with that ID does not exist`);
      }
      const { createdAt, updatedAt, ...ordinaryMeal } = meal.dataValues;
      ordinaryMeal.quantity = Number(quantity);
      const today = MenuControllers.generateDate();
      const menu = Menu.findAll({ where: { adminId: req.admin.id, createdAt: today } });
      let menuMeals = [];
      if (menu.length === 0) {
        menuMeals.push(ordinaryMeal);
        Menu.create({
          meals: JSON.stringify(menuMeals),
          adminId: req.admin.id
        });
        Meal.update({ quantity }, { where: { id: mealId } });
      } else {
        menuMeals = MenuControllers.updateMeals(menu[0], ordinaryMeal, mealId, quantity);
        Menu.update(
          { meals: JSON.stringify(menuMeals) },
          { where: { adminId: req.admin.id, createdAt: today } }
        );
        const mealIndex = menuMeals.findIndex(menuMeal => menuMeal.id === Number(mealId));
        Meal.update({ quantity: menuMeals[mealIndex].quantity }, { where: { id: mealId } });
      }
      return res.status(200).json({
        status: true,
        message: `menu added to today's menu successfully`,
        addMenu: menuMeals
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
  }

  getSingleMenu(req, res) {
    try {
      const today = MenuControllers.generateDate();
      const menu = Menu.findOne({ where: { createdAt: today, adminId: req.admin.id } });
      return res.status(200).json({
        status: true,
        message: 'Menu Retrieved Successfully',
        FetchData: menu
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
  }

  updateMeals(menu, ordinaryMeal, mealId, quantity) {
    try {
      const { meals } = menu.dataValues;
      const updatedMenuMeals = JSON.parse(meals);
      const mealIndex = updatedMenuMeals.findIndex(menuMeal => menuMeal.id === Number(mealId));
      if (mealIndex < 0) {
        updatedMenuMeals.push(ordinaryMeal);
      } else {
        updatedMenuMeals[mealIndex].quantity += Number(quantity);
      }
      return updatedMenuMeals;
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
  }
}

export default MenuControllers;
