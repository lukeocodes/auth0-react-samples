import React, { Component } from 'react'

class Profile extends Component {
  render() {
    const { isAuthenticated, getProfile } = this.props.auth

    let Profile = ('')

    if (isAuthenticated() && getProfile()) {
      Profile = (
        <div className="card-body">
          <img src={ getProfile().picture } className="rounded float-left" style={{ paddingRight: "1rem", width: "200px", height: "200px" }} alt="..."></img>
          <h5 className="card-title">{ getProfile().nickname }</h5>
          <span className="card-text"><pre><code>{ JSON.stringify(getProfile(), null, 2) }</code></pre></span>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="row" style={{ marginTop: "2rem" }}>
          <div className="col-sm">
            <div className="card mb-3">
              {Profile}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
