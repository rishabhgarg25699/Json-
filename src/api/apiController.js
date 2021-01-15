const DB = require("../db.js");
const {modifyDataIfParams, breakUrl} = require("../utils/helper");
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');


module.exports = {
  read: function (req, res) {
    const urlComponents = breakUrl(req.url);

    // deep copy of the current data found in store.json
    const currentData = DB.read();
    console.log(currentData);
    // shallow copy of the part of current data as pointed by urlComponents
    console.log(urlComponents);
    console.log(_.isEmpty(urlComponents));
    const data = _.isEmpty(urlComponents) ? currentData : _.get(currentData, urlComponents);
    console.log(data);
    if (!data) {
      res.status(404)
        .json({
          success: false,
          message: 'Unable to locate resource, you are trying to access.'
        });
      return;
    }
    
    // sorted, searched or filtered data if req.query
    const modifiedData = modifyDataIfParams(data, req.query);
    if (!modifiedData) {
      res.status(400)
        .json({
          success: false,
          message: 'Invalid filter, sort or search object, please look documentation for more detail'
        });
      return;
    }

    res.status(200)
      .json({
        success: true,
        data: modifiedData
      });
  },

  post: async function(req, res) {
    if(_.keys(req.body).length !== 1 ) {
      res.status(400)
        .json({
          success: false,
          message: 'Request body must be single value pair, where key must be string and value can be of any type'
        });
        return;
    }
    const bodyKey = _.keys(req.body).shift();
    
    const bodyVal = req.body[bodyKey];
    
    bodyVal._id = uuidv4();
    

    const urlComponents = breakUrl(req.url);

    // deep copy of the current data found in store.json
    const currentData = DB.read();
    
    // shallow copy of the part of current data as pointed by urlComponents
    const data = _.get(currentData, urlComponents);
    
    if (!data) {
      res.status(404)
        .json({
          success: false,
          message: 'Unable to find the location where to add data, please see documentation for more detail'
        });
      return;
    }

    if(_.has(data, bodyKey)) {
      res.status(400)
        .json({
          success: true,
          message: 'Key already exist, please use PUT or PATCH method if want to update it'
        });
        return;
    }
    data[bodyKey] = bodyVal;
    try{
      await DB.save(currentData);
      res.status(201)
      .json({
        success: true,
        data: req.body
      });

    } catch(err) {
      res.status(500)
        .json({
          success: false,
          message: 'Something is broke, let me note it and work on it. Thanks for telling me!!'
        });
    }

  }
};


