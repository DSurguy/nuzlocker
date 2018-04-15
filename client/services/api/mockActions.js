export default {
  '^/login$': {
    'POST': function (mockState, fetchData={}){
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
  '^/run$': {
    'POST': function (mockState, fetchData={}){
      let nextId = 0;
      for( let run of mockState.runs ){
        if( run.id === fetchData.id ) return Promise.reject({
          status: 400,
          message: 'Duplicate Run ID, use PUT instead'
        })
        if( run.id >= nextId ) nextId = run.id+1
      }
      let newRun = {
        id: nextId,
        events: [],
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
  '^/run/[0-9]+$': {
    'PUT': function (mockState, fetchData){
      let maxId = 0;
      for( let run of mockState.runs ){
        if( run.id === fetchData.id ){
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
    'GET': function (mockState){
      let maxId = 0;
      for( let run of mockState.runs ){
        if( run.id === fetchData.id ) return Promise.resolve({
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
  '^/runs$': {
    'GET': function (mockState){
      return Promise.resolve({
        status: 200,
        data: (mockState.runs||[]).filter(run=>run.userId==mockState.currentUser.id)
      })
    }
  }
}