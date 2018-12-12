import React, { Component } from 'react'

class Home extends Component {
  render() {
    return (
      <div className="container">
        <div className="row" style={{ marginTop: "2rem" }}>
          <div className="col-sm">
            <div className="card-group">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">2. Calling your backend</h5>
                  <p className="card-text">
                    This scenario shows an SPA using an id_token to access an API.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
