import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Nav extends Component {
  login() {
    this.props.auth.login()
  }

  logout(returnTo) {
    this.props.auth.logout(`${window.location.origin}/${returnTo || ''}`)
  }

  render() {
    const { isAuthenticated, getProfile } = this.props.auth

    let NavProfile = ('')

    if (isAuthenticated() && getProfile()) {
      NavProfile = (
        <span className="navbar-text">
          <img src={ getProfile().picture } alt={ getProfile().nickname } style={{ width: "24px",  height: "24px", marginRight: ".5rem" }} className="float-left rounded-circle" />
          <span style={{ marginRight: ".5rem" }}>{ getProfile().nickname }</span>
        </span>
      )
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">Auth0 React Sample</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {
              isAuthenticated() && (
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
              )
            }
            {
              isAuthenticated() && (
                <li className="nav-item">
                  <Link to="/ping" className="nav-link">Ping</Link>
                </li>
              )
            }
          </ul>
          {NavProfile}
          <ul className="navbar-nav">
          {
              isAuthenticated() && (
                <li className="nav-item">
                  { /* eslint-disable-next-line */ }
                  <a id="qsLogoutBtn" className="nav-link" style={{ cursor: 'pointer' }} onClick={() => this.logout()}>
                    Log Out
                  </a>
                </li>
              )
            }
            {
              !isAuthenticated() && (
                <li className="nav-item">
                  { /* eslint-disable-next-line */ }
                  <a id="qsLoginBtn" className="nav-link" style={{ cursor: 'pointer' }} onClick={() => this.login()}>
                    Login
                  </a>
                </li>
              )
            }
          </ul>
        </div>
      </nav>
    )
  }
}

export default Nav
