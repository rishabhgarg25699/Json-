
const db = require("../db.js");
const { getEntityFromData, fliterData } = require("../utils/helpers");

const read = async (req, res)=> {
  try {
    let entities = req.url.split("/");
         entities =  entities.slice(1, entities.length - 1);
    const jsonData = await db.getData();
    
    let dataToReturn = getEntityFromData(entities, jsonData);
    
    if(!dataToReturn) {
      res.status(400)
        .json({
          success: false,
          message: "Bad Request, No such entity or field exist in db"
        });
      return;
    }
    
    if(JSON.stringify(req.query) !== JSON.stringify({})) 
      dataToReturn = fliterData(dataToReturn, req.query);

    res.status(200)
      .json({
        success: true,
        data: dataToReturn
      });

  } catch (err) {
    console.error(err);
    res.status(500)
      .json({
        success: false,
        message: "Internal Server Error, Something is broken, please notify us!"
      });
  }
};


module.exports = {
  read,

}