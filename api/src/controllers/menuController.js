import menu from '../models/menu';
class menuControllers {
  getTodayMenu(req, res) {
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
  createMenu(req, res) {
    if (!req.body.name) {
      return res.status(400).send({
        success: false,
        message: 'name is required'
      });
    } else if (!req.body.day) {
      return res.status(400).send({
        success: false,
        message: 'day is required'
      });
    }
    const allMenu = {
      id: menu.length + 1,
      name: req.body.name,
      day: req.body.day
    };
    menu.push(allMenu);
    return res.status(201).send({
      success: true,
      message: `menu added to today's menu successfully`,
      menu
    });
  }
}
const menuController = new menuControllers();
export default menuController;
