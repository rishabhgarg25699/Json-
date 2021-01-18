const _  = require('lodash');

// todo lets work on it later...
const filterData = (data, cond) =>{
  cond = cond.map((con)=> JSON.parse(con));
  console.log(cond);
  return data;
}

const searchData = (data, cond) => {
  return data;
}

const sortData = (data, cond) => {
  return data;
}
 
module.exports = {
  // to-do remove this function it is not needed now
  modifyDataIfParams: function(data, params) {
    // do nothing if params are not present
    if(_.isEmpty(params)) return data;
    
    // filters data
    if(_.has(params, '_filter')) {
        data = filterData(data, _.get(params, '_filter'));
    }

    // search value on the data and returns it in array
    if(_.has(params, '_search')) {
      data = searchData(data, _.get(params, '_search'));
    }
    
    // sorts data either ascending or descending
    if(_.has(params, '_sort')) {
      data = sortData(data, _.get(params, '_sort'));
    }

    return data;
  },

  /**
 * @returns Array<string> 
 * @description splits the req url into parts.
 *  e.g.. ReqUrl => GET /user/address/street ---> breakUrl(req.url) ---> returns ['user','address', 'street']   
 */

  breakUrl: function (url) {
  
    let urlComponents = url.split('/');
    // if url starts and end with '/'
    urlComponents = url[url.length - 1] === '/' ? urlComponents.slice(1, urlComponents.length -1) : urlComponents.slice(1);
    // removing queryparams from the url components if exist
    urlComponents = urlComponents.map((compnt) => compnt.split('?').shift());
  
    return urlComponents;
  },

  /**
   * 
   * @param {*} arr - Stored in store.json 
   * @param {*} data  - new data to be inserted
   * @param {*} save - boolean - either to save or not
   */
  array: {
    // to-do return values which can be used to tell if operation successful or not
    push: (arr, data) => {
      arr.push(data);
      return data;
    },
    // to-do times must be a integer ...
    pop: (arr, times) => {
      while(arr.length > 0 && times > 0) {
        arr.pop();
        times--;
      }
    },

    shift: (arr, times) => {
      while(arr.length > 0 && times > 0) {
        arr.shift();
        times--;
      }
    }, 

    beg: (arr, data) => {
      arr.unshift(data);
    },

    sort: (arr, data) => {
      if(data === 'asc') {
        arr.sort(function(a, b){return a-b});
      }
      else {
        arr.sort(function(a, b){return b-a});
      }
    }
  }
}
