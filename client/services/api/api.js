import mockActions from './mockActions.js';

let apiConfig = {};
try{
  if( process.NODE_ENV == 'production' ) apiConfig = require('../../../.env.client.prod.json').api;
  else apiConfig = require('../../../.env.client.dev.json').api;
} catch (e) {
  console.error("Failed to load apiConfig", e);
}

let mockState = {};

function loadMockData(){
  mockState = JSON.parse(localStorage.getItem('mockState')||'{}');
};

function mockFetch(resourcePath, fetchConfig){
  return new Promise((resolve, reject)=>{
    doMockAction(resourcePath, fetchConfig.method, fetchConfig.body)
    .then(resolve)
    .catch(reject)
  })
}

function doMockAction(resourcePath, fetchMethod='GET', fetchData){
  for( let route in mockActions ){
    if( (new RegExp(route)).test(resourcePath) && mockActions[route][fetchMethod] ){
      return mockActions[route][fetchMethod](mockState, fetchData)
      .then((response)=>{
        if( response.stateModified ) localStorage.setItem('mockState', JSON.stringify(mockState))
        return response.data;
      })
    }
  }
  return Promise.reject("Action not supported");
}

class API{
  constructor(){
    if( apiConfig.mock ) loadMockData()
  }

  fetch(resourcePath, fetchConfig={}){
    if( apiConfig.mock ) return mockFetch(resourcePath, fetchConfig)
    return fetch(resourcePath, fetchConfig);
  }
}

let apiExport = new API();

export default apiExport;