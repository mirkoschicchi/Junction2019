import mongoose from 'mongoose';
import Event from './event';
const connectDb = () => {
  return mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
};
const models = { Event };
export { connectDb };
export default models;
