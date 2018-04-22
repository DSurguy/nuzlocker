export default {
  "^/login$": {
    "POST": function (mockState, fetchData={}){
      mockState.user = {
        id: 1,
        username: 'testUser'
      }
      return Promise.resolve({
        status: 200,
        stateModified: true,
        data: mockState.user
      })
    }
  },
  "^/runs$": {
    "GET": function (mockState){
      return Promise.resolve({
        status: 200,
        data: (mockState.runs||[]).filter(run=>run.userId==mockState.user.id)
      })
    },
    "POST": function (mockState, fetchData={}){
      let nextId = 0;
      for( let run of (mockState.runs||[]) ){
        if( run.id === fetchData.id ) return Promise.reject({
          status: 400,
          message: 'Duplicate Run ID, use PUT instead'
        })
        if( run.id >= nextId ) nextId = run.id+1
      }
      let newRun = {
        id: nextId,
        userId: mockState.user.id,
        events: [],
        state: {
          bank: [],
          party: [],
          pokemon: {},
          goalStatus: [],
          routeStatus: {}
        },
        goals: [],
        name: fetchData.name||`Run ${nextId}`,
        game: fetchData.game||'red'
      }
      if( !mockState.runs ) mockState.runs = [];
      mockState.runs.push(newRun)
      return Promise.resolve({
        status: 200,
        stateModified: true,
        data: newRun
      })
    }
  },
  "^/runs/([0-9]+)$": {
    "PUT": function (mockState, fetchData, params){
      let maxId = 0;
      for( let run of (mockState.runs||[]) ){
        if( run.id === params[0] ){
          run.name = fetchData.name||run.name
          return Promise.resolve({
            status: 200,
            stateModified: true,
            data: run
          })
        }
      }
      return Promise.reject({
        status: 404,
        message: 'Run not found'
      })
    },
    'GET': function (mockState, fetchData, params){
      let maxId = 0;
      for( let run of (mockState.runs||[]) ){
        if( run.id === parseInt(params[0]) ) return Promise.resolve({
          status: 200,
          data: run
        })
      }
      return Promise.reject({
        status: 404,
        message: 'Run not found'
      })
    }
  },
  "^/data/?$": {
    "GET": function (mockState){
      return Promise.resolve({
        //Return a static list of the data endpoints available
        status: 200,
        data: [
          'pokemon'
        ]
      })
    }
  },
  "^/data/games/?$": {
    "GET": function (mockState){
      //Return a static list of all supported pokemon
      return Promise.resolve({
        status: 200,
        data: require('../../data/games.json') //thanks webpack
      })
    }
  },
  "^/data/pokemon/?$": {
    "GET": function (mockState){
      //Return a static list of all supported pokemon
      return Promise.resolve({
        status: 200,
        data: require('../../data/pokemon.json') //thanks webpack
      })
    }
  },
  "^/data/routes/?$": {
    "GET": function (mockState){
      //Return a static list of all supported pokemon
      return Promise.resolve({
        status: 200,
        data: require('../../data/routes.json') //thanks webpack
      })
    }
  }
}