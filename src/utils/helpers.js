/**
 * Returns required nested object, based on the request. 
 */
const getEntityFromData = (entities, data) => {
  if ( !Array.isArray(entities) ) return null;
  
  for( let entity of entities ) {
    if( !data[entity] ) return null;
    data = data[entity];
  }
  return data; 
}

/**
 * checks whether it is an object or not. 
 * 
 */
const isObject = (val) => {
  return val && typeof val === 'object' && val.constructor === Object;

}

/**
 * returns boolean, if dataValue and request parameters are equal.
 * here, data type of dataVal and paramVal will both be either a string or number
 */
const shouldFilter = (dataVal, paramVal) => {
  if(dataVal === paramVal) 
    return true;
  else 
    return false;
}

/**
 * 
 * @param {Object, string, number} dataEle 
 * @param {Object} params 
 * @returns boolean
 * @description returns true or false, for filtering array.
 */
const filterEach = (dataEle, params) => {
  let dataVal;
  for (let pKey of Object.keys(params) ) {
    
    if( isObject(dataEle) ) dataVal = dataEle[pKey];
    else dataVal = dataEle;

    if( Array.isArray(params[pKey]) ) {
      for(let pValue of params[pKey]) {
        if(shouldFilter(dataVal, pValue)) return true;
      }
    } else {
      if(shouldFilter(dataVal, params[pKey])) return true;
    }
  } 
}

/**
 * 
 * @param {Array<Object>, Array<String>, Array<Number>} data 
 * @param {Object} params 
 * @returns
 */
const filterData = (data, params) => {
  data = data.filter( (d)=> {
    return filterEach(d, params);
  });
  return data;
}

/**
 * Logic for filtering, searching and sorting data.
 */
const aggregateIfParams = (data, params) => {
  
  if(Object.keys(params).length === 0) {
    return data;
  }

  const filteredData = filterData(data, params);
  return filteredData;
}

module.exports = {
  getEntityFromData,
  aggregateIfParams
}