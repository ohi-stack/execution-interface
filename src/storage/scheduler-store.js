import { ENV } from '../config/env.js';

import * as memory from './memory-scheduler-store.js';
import * as postgres from './postgres-scheduler-store.js';

const store = ENV.ENABLE_DATABASE ? postgres : memory;

export const listEvents = store.listEvents;
export const getEvent = store.getEvent;
export const createEvent = store.createEvent;
export const updateEvent = store.updateEvent;
export const deleteEvent = store.deleteEvent;
