const fs = require("fs/promises");

const getData = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile("/home/onbit-syn/onbit/Json-/data/store.json",
      {
        encoding: "utf-8"
      })
      .then((data) => {
        resolve(JSON.parse(data));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getData: getData
};