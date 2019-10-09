let request = require('request-promise');
const options = {
  method: 'GET',
  headers: {
    'content-type': 'application/json'
  },
  json: true
};

module.exports = {
  get: async (url) => {
    try {
      return await request.get(url, options);
    } catch(err) {
      console.log(`Error in get ${url}==> ${err.message}`)
    }
    
  }
}