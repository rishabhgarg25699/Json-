
const DB = require("../db.js");
const { getEntityFromData, aggregateIfParams } = require("../utils/helpers");

const read = (req, res) => {

  let entities = req.url.split("/");
  entities = entities[entities.length - 1] === "" ?
    entities.slice(1, entities.length - 1) : entities.slice(1);
  entities = entities.map((entity) => {
    return entity.split("?").shift();
  });

  const jsonData = DB.read();

  let dataToReturn = getEntityFromData(entities, jsonData);

  if (!dataToReturn) {
    res.status(400)
      .json({
        success: false,
        message: "Bad Request, No such entity or field exist in db"
      });
    return;
  }
  dataToReturn = aggregateIfParams(dataToReturn, req.query);
  console.log(dataToReturn);
  res.status(200)
    .json({
      success: true,
      data: dataToReturn
    });
};


module.exports = {
  read,

}