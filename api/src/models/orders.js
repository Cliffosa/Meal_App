import Sequelize from 'sequelize';
import sequelize from '../util/db';

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  order: {
    type: Sequelize.JSON,
    allowNull: false
  },
  total: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  delivery_address: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    default: 0
  },
  adminId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  createdAt: Sequelize.DATEONLY,
  updatedAt: Sequelize.DATEONLY
});

export default Order;
