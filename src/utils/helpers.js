const getEntityFromData = (entities, data) => {
  if ( !Array.isArray(entities) ) return null;
  
  for( let entity of entities ) {
    if( !data[entity] ) return null;
    data = data[entity];
  }
  
  return data; 
}

const fliterData = (data, params) => {
  if(Array.isArray(data)) {
    data = data.filter((d) =>{
      Object.keys(params).some((paramKey) => d[paramKey] === params[paramKey]));
    } 
    return data;
  }
}

module.exports = {
  getEntityFromData,
  fliterData
}