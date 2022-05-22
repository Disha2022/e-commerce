// import important parts of sequelize library
const { Model, DataTypes, INTEGER } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns
    id:{
        // id=========================
    // use the special Sequelize DataTypes object provide what type of data it is
    type: DataTypes.INTEGER,
    //this is the equivalent of SQL's `not null` option
    allowNull: false,
    //instruct that this is the Primary Key
    primaryKey: true,
    //turn on auto increment
    autoIncrement: true,
    },
    product_name:{
type:DataTypes.STRING,
allowNull:false
    },
   price:{
     type:DataTypes.DECIMAL,
     allowNull:false,
     //validate that value is a decimal============
   },
   stock:{
     type:DataTypes.INTEGER,
     allowNull:false,
     defaultValue:10,
     //validate value is numeric

   },
   catagory_id:{
     type:INTEGER,
     //reference catagory id
   }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
