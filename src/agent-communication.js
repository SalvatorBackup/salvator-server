const axios = require('axios')

class AgentCommunication {
  constructor(options) {
    this.endpoint = options.endpoint
    this.token = options.token
  }

  async ping() {
    return axios.get(`${this.endpoint}/ping`, {
      headers: {
        'x-auth': this.token
      },
      resolveWithFullResponse: true
    })
  }

  async saveOrder(saveOrder) {
    return axios.post(`${this.endpoint}/save-order`, saveOrder, {
      headers: {
        'x-auth': this.token
      },
      responseType: 'stream'
    })
  }
}

module.exports = AgentCommunication
