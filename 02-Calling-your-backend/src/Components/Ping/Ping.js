import React, { Component } from 'react'
import axios from 'axios'
import { CONFIG } from '../../config'

class Ping extends Component {
  constructor(props) {
    super(props)
    this.state = { message: 'API responses will appear here.' }
  }

  callPublic(url) {
    this.callApi(url, {})
  }

  callPrivate(url) {
    const { getIdToken } = this.props.auth
    this.callApi(url, { 'Authorization': `Bearer ${getIdToken()}`})
  }

  callApi(url, headers) {
    axios.defaults.baseURL = CONFIG.baseURL
    axios.get(url, { headers })
      .then(response => this.setState({ message: response.data.message }))
      .catch(error => this.setState({ message: error.message }))
  }

  render() {
    return (
      <div className="container">
        <div className="row" style={{ marginTop: "2rem" }}>
          <div className="col-sm">
            <div className="card-deck">
              <div className="card">
                <div className="card-body">
                  <p className="card-text">Call a public endpoint.</p>
                </div>
                <div className="card-footer">
                  <button type="button" className="btn btn-primary btn-block " style={{ cursor: 'pointer' }} onClick={() => this.callPublic('/public')}>Call Public</button>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <p className="card-text">Call a private endpoint.</p>
                </div>
                <div className="card-footer">
                  <button type="button" className="btn btn-danger btn-block " style={{ cursor: 'pointer' }} onClick={() => this.callPrivate('/private')}>Call Private</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: "2rem" }}>
          <div className="col-sm">
            <div className="card">
              <div className="card-header">Log in to call a private (secured) server endpoint.</div>
              <div className="card-body">
                <p className="card-text">{ this.state.message }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Ping
