const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    
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
      //Product id Name=====================
      product_id: {
        type: DataTypes.INTEGER,
        //reference product model id
    
      },
     tag_id: {
      type: DataTypes.INTEGER,
      //reference tag model id

      }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
