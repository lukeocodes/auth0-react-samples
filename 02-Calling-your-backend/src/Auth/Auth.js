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

const tokenValidator = (token, expiresAt) => {
  return token
    && expiresAt instanceof Date
    && (Date.now() + 60000) < expiresAt.getTime()
}

class Auth {
  userProfile = null
  idToken = null
  idTokenExpiresAt = null

  webAuth = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    redirectUri: AUTH_CONFIG.callbackUrl,
    clientID: AUTH_CONFIG.clientId,
    responseType: 'id_token',
    scope: 'openid profile email'
  })

  constructor() {
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.renewAuthentication = this.renewAuthentication.bind(this)
    this.getIdToken = this.getIdToken.bind(this)

    this.loginCallback = () => {}
    this.logoutCallback = () => {}
  }

  login(customState) {
    this.webAuth.authorize({ state: encodeState(customState) })
  }

  logout(returnTo) {
    this.localLogout()
    this.webAuth.logout({ returnTo: returnTo, clientID: AUTH_CONFIG.clientId })
  }

  isAuthenticated() {
    return localStorage.getItem(localStorageKey) ===  'true'
  }

  renewAuthentication() {
    return new Promise((resolve, reject) => {
      this.webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          console.log(err)
          this.localLogout()

          return reject(err)
        }

        this.localLogin(authResult)
        return resolve(authResult)
      })
    })
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (err) {
          console.log(err)
          this.localLogout()

          return reject(err)
        }

        this.localLogin(authResult)
        return resolve(authResult)
      })
    })
  }

  localLogin(authResult) {
    localStorage.setItem(localStorageKey, true)

    this.userProfile = authResult.idTokenPayload
    this.idToken = authResult.idToken
    this.idTokenExpiresAt = new Date(this.userProfile.exp * 1000)

    this.loginCallback({
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.state,
      stateJson: decodeState(authResult) || {}
    })
  }

  localLogout() {
    localStorage.removeItem(localStorageKey)

    this.userProfile = null
    this.idToken = null
    this.idTokenExpiresAt = null

    this.logoutCallback({ loggedIn: false })
  }

  getProfile() {
    return this.userProfile
  }

  isIdTokenValid() {
    return tokenValidator(this.idToken, this.idTokenExpiresAt)
  }

  getIdToken() {
    if (!this.isIdTokenValid()) {
      this.renewAuthentication()
    }

    return this.idToken
  }
}

export default new Auth()