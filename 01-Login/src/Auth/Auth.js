import auth0 from 'auth0-js'
import { AUTH_CONFIG } from './auth0-variables'

const localStorageKey = 'isLoggedIn'

const generateSecureString = () => {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let array = new Uint8Array(40)

  window.crypto.getRandomValues(array)
  array = array.map(x => validChars.charCodeAt(x % validChars.length))

  return String.fromCharCode.apply(null, array)
}

const encodeState = customState => {
  const state = {
    secureString: generateSecureString(),
    customState: customState || {}
  }

  return btoa(JSON.stringify(state))
}

const decodeState = authResult => {
  let parsedState = {}

  try {
    parsedState = JSON.parse(atob(authResult.state))
  } catch (e) {
    parsedState = {}
  }

  return parsedState.customState
}

class Auth {
  userProfile = null

  webAuth = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    redirectUri: AUTH_CONFIG.callbackUrl,
    clientID: AUTH_CONFIG.clientId,
    responseType: 'id_token',
    scope: 'openid profile email'
  })

  loginCallback = () => {}
  logoutCallback = () => {}

  login = (customState) => {
    this.webAuth.authorize({ state: encodeState(customState) })
  }

  logout = (returnTo) => {
    this.localLogout()
    this.webAuth.logout({ returnTo: returnTo, clientID: AUTH_CONFIG.clientId })
  }

  isAuthenticated = () => {
    return localStorage.getItem(localStorageKey) ===  'true'
  }

  renewAuthentication = () => {
    this.webAuth.checkSession({}, this.handleAuthResult.bind(this))
  }

  handleAuthentication = () => {
    this.webAuth.parseHash(this.handleAuthResult.bind(this))
  }

  handleAuthResult = (err, authResult) => {
    if (authResult) {
      this.localLogin(authResult)
    } else if (err) {
      console.log(err)
      this.localLogout()
    }
  }

  localLogin = (authResult) => {
    localStorage.setItem(localStorageKey, true)

    this.userProfile = authResult.idTokenPayload

    this.loginCallback({
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.state,
      stateJson: decodeState(authResult) || {}
    })
  }

  localLogout = () => {
    localStorage.removeItem(localStorageKey)

    this.userProfile = null

    this.logoutCallback({ loggedIn: false })
  }

  getProfile = () => {
    return this.userProfile
  }
}

export default new Auth()
