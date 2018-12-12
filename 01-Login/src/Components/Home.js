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
                  <h5 className="card-title">1. Logging In</h5>
                  <p className="card-text">
                    This scenario demonstrates logging in, user profile information, gated
                    content (you must be logged in to access the user profile), and logging out.
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
