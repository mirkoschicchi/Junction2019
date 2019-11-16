import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  device: String,
  beacon: String
});

const Event = mongoose.model('Event', eventSchema);

Event.index({ device: 1, beacon: 1}, { unique: true });;

export default Event;
