const { ENV } = require('../config/env');

const memory = require('./memory-scheduler-store');
const postgres = require('./postgres-scheduler-store');

const store = ENV.ENABLE_DATABASE ? postgres : memory;

module.exports = {
  listEvents: store.listEvents,
  getEvent: store.getEvent,
  createEvent: store.createEvent,
  updateEvent: store.updateEvent,
  deleteEvent: store.deleteEvent
};
