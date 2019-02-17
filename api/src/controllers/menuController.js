import menu from '../models/menu';

class menuControllers {
  // method to get all menu
  getAllMenu(req, res) {
    const { day } = req.params;
    let todayMenu = [];
    let found = false;
    menu.map(meal => {
      if (meal.day === day) {
        todayMenu.push(meal);
        found = true;
      }
    });
    if (found) {
      return res.status(200).send({
        success: true,
        message: 'menu for the day retrieved successfully',
        meals: todayMenu
      });
    }
    return res.status(404).send({
      success: false,
      message: 'Sorry, no menu for today'
    });
  }

  // create a menu for a specific day
  createMenu(req, res) {
    // validate body
    if (!req.body.name) {
      return res.status(400).send({
        success: false,
        message: 'name is required'
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: false,
        message: 'price is required'
      });
    }
    const allMenu = {
      id: menu.length + 1,
      name: req.body.name,
      price: req.body.price
    };
    menu.push(allMenu);
    return res.status(201).send({
      success: true,
      message: 'menu added successfully',
      menu
    });
  }
}

// create an instance of the class and export it
const menuController = new menuControllers();
export default menuController;
