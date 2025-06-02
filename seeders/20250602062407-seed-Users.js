'use strict';
const fs = require("fs").promises
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const data = JSON.parse(await fs.readFile("./data/Users.json", "utf-8"))
    
    
    const users = data.map(el =>{
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(el.password, salt);
      el.password = hash
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
    })
    
    await queryInterface.bulkInsert("Users", users)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
  }
};
