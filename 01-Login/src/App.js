import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import Nav from './Components/Nav'
import Home from './Components/Home'
import Callback from './Components/Callback'
import Profile from './Components/Profile'

class App extends Component {
  loggedIn(state) {
    const { history } = this.props
    this.setState({ loggedIn: state.loggedIn })

    if (typeof state.stateJson.target !== undefined) {
      history.push(state.stateJson.target)
    } else {
      history.push('/')
    }
  }

  loggedOut(state) {
    const { history } = this.props
    this.setState({ loggedIn: state.loggedIn })

    history.push('/')
  }

  constructor(props) {
    super(props)
    const { auth } = props

    auth.loginCallback = this.loggedIn.bind(this)
    auth.logoutCallback = this.loggedOut.bind(this)

    this.state = { loggedIn: false }
  }

  componentWillMount() {
    const { isAuthenticated, renewAuthentication } = this.props.auth

    if (isAuthenticated()) {
      renewAuthentication()
    }
  }

  render() {
    const { auth } = this.props
    const { isAuthenticated, login } = auth

    return (
        <div className='App'>
          <Nav auth={auth} />

          <Route path='/' exact component={Home} />
          <Route path='/callback' render={(props) => <Callback auth={auth} />} />
          <Route path='/profile' render={(props) => {
            if (!isAuthenticated()) {
              login({ target: '/profile' })
            }

            return <Profile auth={auth} />
          }} />
        </div>
    )
  }
}

export default withRouter(App)
