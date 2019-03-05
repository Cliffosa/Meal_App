import Order from '../models/orders';
import OrderItem from '../models/orderItems';
import Meal from '../models/meals';
import Menu from '../models/menu';

class OrderController {
  async addMealToOder(req, res) {
    try {
      const { mealId, quantity } = req.body;
      const orderItem = await OrderItem.findOne({ where: { mealId, userId: req.user.id } });
      const result = {};
      // check order exist
      if (orderItem) {
        result.body = {
          status: false,
          message: 'Orders Already Exist!!!'
        };
      } else {
        // create new order
        const newOrderItem = await OrderItem.create({ mealId, quantity, userId: req.user.id });
        result.body = {
          status: true,
          message: 'Order Sucessfully Added!',
          createdOrder: newOrderItem
        };
      }
      return res.status(201).json(result.body);
    } catch (error) {
      return res.status(500).json({
        status: 'error creating order',
        message: error.message
      });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({ where: { adminId: req.admin.id } });
      return res.status(200).json({
        status: true,
        message: 'Orders Retrieved Successfully!',
        fetchData: orders
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error fetching orders',
        message: error.message
      });
    }
  }

  async updateOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { action } = req.body;
      const orderItem = await OrderItem.findOne({
        where: { id: orderId, userId: req.user.id },
        include: [Meal]
      });
      if (action === 'increase') {
        orderItem.quantity++;
        if (orderItem.quantity > orderItem.meal.quantity) {
          throw new Error(
            `We only have ${orderItem.meal.quantity} of ${orderItem.meal.name} is available`
          );
        }
        OrderItem.update(
          {
            quantity: orderItem.quantity
          },
          { where: { id: orderItem.id } }
        );
      } else if (action === 'decrease') {
        orderItem.quantity--;
        if (orderItem.quantity === 0) {
          OrderItem.destroy({ where: { id: orderItem.id } });
        } else {
          OrderItem.update({ quantity: orderItem.quantity }, { where: { id: orderItem.id } });
        }
      } else if (action === 'delete') {
        OrderItem.destroy({ where: { id: orderItem.id } });
      }
      return res.status(200).json({
        status: true,
        message: 'Order Updated Successfully'
      });
    } catch (error) {
      return res.status(500).json({
        status: flase,
        message: error.message
      });
    }
  }

  async getOrderItems(req, res) {
    try {
      const orderItems = await OrderItem.findAll({
        where: { userId: req.user.id },
        include: [Meal]
      });
      if (!orderItems) {
        throw new Error('No order for this user!');
      }
      const meals = [];
      let total = 0;
      orderItems.map(orderItem => {
        //@todo forEach
        const orderMeal = { ...orderItem };
        orderMeal.meal.quantity = orderItem.quantity;
        meals.push(orderMeal.meal);
        let resultOrder = orderItem.quantity * orderMeal.meal.price;
        total += resultOrder;
      });
      const order = { meals, total };
      return res.status(200).json({
        status: true,
        message: 'Orders Retrieved Successfully',
        fetchData: order
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error fetching order',
        message: error.message
      });
    }
  }

  async checkoutOrder(req, res) {
    try {
      const orderItems = await OrderItem.findAll({
        where: { userId: req.user.id },
        include: [Meal]
      });
      const meals = [];
      const admins = new Set();
      orderItems.map(orderItem => {
        //@todo forEach
        const orderMeal = { ...orderItem };
        orderMeal.meal.quantity = orderItem.quantity;
        meals.push(orderMeal.meal);
        admins.add(orderMeal.meal.adminId);
      });
      ordersController.reduceQuantity(meals);
      await OrderItem.destroy({ where: { userId: req.user.id } });
      ordersController.createOrders(admins, meals, req.body.delivery_address, req.user.id);
      return res.status(201).json({
        status: 'success',
        message: 'Order Made'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  async decreaseQuantity(meals) {
    try {
      const meal = meals[0];
      await Meal.findOne({ where: { id: meal.id } })
        .then(dbMeal => {
          return dbMeal.update(
            { quantity: dbMeal.quantity - meal.quantity },
            { where: { id: meal.id } }
          );
        })
        .then(() => {
          return Menu.findOne({ where: { adminId: meal.adminId } });
        })
        .then(menu => {
          const menuMeals = JSON.parse(menu.meals);
          const updatedMenuMeals = menuMeals.map(menuMeal => {
            const updatedMenuMeal = { ...menuMeal };
            if (menuMeal.id === meal.id) {
              updatedMenuMeal.quantity -= meal.quantity;
            }
            return updatedMenuMeal;
          });
          return menu.update(
            { meals: JSON.stringify(updatedMenuMeals) },
            { where: { id: menu.id } }
          );
        })
        .then(() => {
          meals.shift();
          if (meals.length !== 0) {
            ordersController.decreaseQuantity(meals);
          } else {
            return true;
          }
        });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createOrder(admins, meals, delivery_address, userId) {
    try {
      admins.map(admin => {
        let adminTotal = 0;
        const adminMeals = meals.filter(meal => meal.adminId === admin);
        adminMeals.map(adminMeal => {
          adminTotal += adminMeal.quantity * adminMeal.price;
        });
        Order.create({
          order: JSON.stringify(adminMeals),
          total: adminTotal,
          delivery_address: delivery_address,
          adminId: admin,
          userId,
          status: 0
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const OrdersController = new OrderController();
export default OrdersController;
