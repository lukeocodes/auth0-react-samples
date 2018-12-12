import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class Callback extends Component {
  componentWillMount() {
    const { handleAuthentication } = this.props.auth

    if (/access_token|id_token|error/.test(window.location.hash)) {
      handleAuthentication()
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth

    if (!isAuthenticated()) {
      return <Redirect to="/" />
    }

    return <p>Callback! Redirecting...</p>
  }
}

export default Callback
