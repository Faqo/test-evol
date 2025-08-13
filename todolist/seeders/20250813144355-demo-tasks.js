'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Tarea de ejemplo 1',
        description: 'Esta es una tarea de prueba completada',
        completed: true,
        tags: ['ejemplo', 'demo'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tarea de ejemplo 2', 
        description: 'Esta es una tarea pendiente',
        completed: false,
        tags: ['pendiente', 'trabajo'],
        dueDate: new Date('2024-12-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Tarea de ejemplo 3',
        description: 'Tarea con etiquetas múltiples',
        completed: false,
        tags: ['urgente', 'revisar', 'importante'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};