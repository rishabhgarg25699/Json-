

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

const post = async (req, res) => {
  let entities = req.url.split("/");
  entities = entities[entities.length - 1] === "" ?
    entities.slice(1, entities.length - 1) : entities.slice(1);
  entities = entities.map((entity) => {
    return entity.split("?").shift();
  });
  
  const jsonData = DB.read();
  let data = getEntityFromData(entities, jsonData);
 
  if (!data) {  
    res.status(400)
      .json({
        success: false,
        message: "Bad Request, No such entity or field exist in db"
      });
    return;
  }
  
  if(!req.body.id) req.body.id = +new Date();

  if(Array.isArray(data)) {
    data.push(req.body);
  }
  else {
    Object.keys(req.body).forEach((key)=> {
      data[key] = req.body[key];
    });
  }
  

  try {
    await DB.save(jsonData);
    res.status(201)
      .json({
        success: true,
        data: jsonData
      });

  } catch(err) {
    console.log(err);
    res.status(500)
      .json({
        success: false,
        message: "Internal Server Error"
      });
  }

}; 

const patch = async (req, res) => {
  let entities = req.url.split("/");
  entities = entities[entities.length - 1] === "" ?
    entities.slice(1, entities.length - 1) : entities.slice(1);
  entities = entities.map((entity) => {
    return entity.split("?").shift();
  });
  
  const jsonData = DB.read();
  let data = getEntityFromData(entities, jsonData);
 
  if (!data) {  
    res.status(400)
      .json({
        success: false,
        message: "Bad Request, No such entity or field exist in db"
      });
    return;
  }
  
  if(req.body.id) {
    res.status(400)
      .json({
        success: false,
        message: "Bad Request, can't update id field of schema"
      });
    return;
  }

  if(Array.isArray(data)) {
    data.push(req.body);
  }
  else {
    Object.keys(req.body).forEach((key)=> {
      data[key] = req.body[key];
    });
  }
  

  try {
    await DB.save(jsonData);
    res.status(201)
      .json({
        success: true,
        data: jsonData
      });

  } catch(err) {
    console.log(err);
    res.status(500)
      .json({
        success: false,
        message: "Internal Server Error"
      });
  }
}

const del = async (req, res) => {
  let entities = req.url.split("/");
  entities = entities[entities.length - 1] === "" ?
    entities.slice(1, entities.length - 1) : entities.slice(1);
  entities = entities.map((entity) => {
    return entity.split("?").shift();
  });
  
  const jsonData = DB.read();
  let data = getEntityFromData(entities, jsonData);
  console.log(data);
  if (!data) {  
    res.status(400)
      .json({
        success: false,
        message: "Bad Request, No such entity or field exist in db"
      });
    return;
  }
  delete data;
  try {
    await DB.save(jsonData);
    res.status(201)
      .json({
        success: true,
        data: jsonData
      });

  } catch(err) {
    console.log(err);
    res.status(500)
      .json({
        success: false,
        message: "Internal Server Error"
      });
  }  
}

module.exports = {
  read,
  post,
  patch,
  del
}