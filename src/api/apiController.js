const DB = require("../db.js");
const {modifyDataIfParams, breakUrl} = require("../utils/helper");
const _ = require('lodash');


module.exports = {
  read: function (req, res) {
    const urlComponents = breakUrl(req.url);

    // deep copy of the current data found in store.json
    const currentData = DB.read();
    
    // part of current data as pointed by urlComponents
    const data = _.isEmpty(urlComponents) ? currentData : _.get(currentData, urlComponents);
    
    // if the data pointed by the request url do not exist
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
    // validating the request body which must be single key value pair
    if(_.keys(req.body).length !== 1 ) {
      res.status(400)
        .json({
          success: false,
          message: 'Request body must be single value pair, where key must be string and value can be of any type'
        });
        return;
    }
    // getting key of data in request payload.
    const bodyKey = _.keys(req.body).shift();
    
    const bodyVal = req.body[bodyKey];
    
    // storing unique id, later this id can be used to search for data in the complete database..
    const urlComponents = breakUrl(req.url);

    // deep copy of the current data found in store.json
    const currentData = DB.read();
    
    // part of current data as pointed by urlComponents
    const data = _.isEmpty(urlComponents) ? currentData : _.get(currentData, urlComponents);
    
    // if parent Entity of the data do not exist
    if (!data) {
      res.status(404)
        .json({
          success: false,
          message: 'Invalid path in the object, please see documentation for more detail'
        });
      return;
    }

    if(_.isArray(data)) {
      res.status(400)
        .json({
          success: false,
          message: 'Invalid request method, cannot add key-value pair to existing data, kindly use PUT or PATCH method'
        })
      return;
    }
    // if key already exist
    if(_.has(data, bodyKey)) {
      res.status(400)
        .json({
          success: true,
          message: 'Key already exist, please use PUT or PATCH method if want to update it'
        });
        return;
    }

    data[bodyKey] = bodyVal;
    // saving updated data to data store....
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
    };

  },

  patch: async (req, res)=> {
    if(_.keys(req.body).length !== 1 ) {
      res.status(400)
        .json({
          success: false,
          message: 'Request body must be single value pair, where key must be string and value can be of any type'
        });
        return;
    }
    // getting key of data in request payload.
    const bodyKey = _.keys(req.body).shift();
    
    const bodyVal = req.body[bodyKey];
    
    // storing unique id, later this id can be used to search for data in the complete database..
    const urlComponents = breakUrl(req.url);

    // deep copy of the current data found in store.json
    const currentData = DB.read();
    
    // part of current data as pointed by urlComponents
    const data = _.isEmpty(urlComponents) ? currentData : _.get(currentData, urlComponents);
    
    // if parent Entity of the data do not exist
    if (!data) {
      res.status(404)
        .json({
          success: false,
          message: 'Invalid path in the object, please see documentation for more detail'
        });
      return;
    }
    // if key already exist
    if(!_.has(data, bodyKey)) {
      res.status(400)
        .json({
          success: true,
          message: 'Wrong request method, PATCH method cannot create new content, can only update it'
        });
        return;
    }

    if(_.isArray(data[bodyKey])) {
      data[bodyKey].push(bodyVal);
    } else {
      data[bodyKey] = bodyVal;
    }

    // saving updated data to data store....
    try{
      await DB.save(currentData);
      res.status(200)
      .json({
        success: true,
        data: data
      });

    } catch(err) {
      res.status(500)
        .json({
          success: false,
          message: 'Something is broke, let me note it and work on it. Thanks for telling me!!'
        });
    };
    
  } 
};


