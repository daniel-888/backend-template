import mongoose from "mongoose";



const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const initDB = async (): Promise<void> => {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB,
  } = process.env;

  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

  return new Promise((resolve, reject) => {
    mongoose
      .connect(url, options)
      .then(function () {
        console.log("MongoDB is connected");
        resolve();
      })
      .catch(function (err) {
        console.log(err);
        reject();
      });
    })
}

export default initDB;