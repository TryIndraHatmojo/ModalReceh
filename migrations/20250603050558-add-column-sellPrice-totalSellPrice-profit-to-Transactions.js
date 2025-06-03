'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Transactions", "sellPrice", {
      type: Sequelize.INTEGER
    })

    await queryInterface.addColumn("Transactions", "totalSellPrice", {
      type: Sequelize.BIGINT
    })

    await queryInterface.addColumn("Transactions", "profit", {
      type: Sequelize.BIGINT
    })

    await queryInterface.addColumn("Transactions", "profitPersen", {
      type: Sequelize.FLOAT
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Transactions", "sellPrice")
    await queryInterface.removeColumn("Transactions", "totalSellPrice")
    await queryInterface.removeColumn("Transactions", "profit")
    await queryInterface.removeColumn("Transactions", "profitPersen")
  }
};
