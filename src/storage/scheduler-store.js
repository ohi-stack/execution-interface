import { ENV } from '../config/env.js';

import * as memory from './memory-scheduler-store.js';
import * as postgres from './postgres-scheduler-store.js';

const store = ENV.ENABLE_DATABASE ? postgres : memory;

export const listEvents = store.listEvents;
export const getEvent = store.getEvent;
export const createEvent = store.createEvent;
export const updateEvent = store.updateEvent;
export const deleteEvent = store.deleteEvent;
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
