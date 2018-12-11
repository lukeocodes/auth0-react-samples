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
  accessToken = null
  accessTokenExpiresAt = null

  webAuth = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    redirectUri: AUTH_CONFIG.callbackUrl,
    clientID: AUTH_CONFIG.clientId,
    responseType: 'token id_token',
    scope: 'openid profile email',
    audience: AUTH_CONFIG.apiAudience
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

  handleAuthentication = () => {
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

  localLogin = (authResult) => {
    localStorage.setItem(localStorageKey, true)

    this.userProfile = authResult.idTokenPayload
    this.idToken = authResult.idToken
    this.idTokenExpiresAt = new Date(this.userProfile.exp * 1000)
    this.accessToken = authResult.accessToken
    this.accessTokenExpiresAt = new Date((new Date().getTime())+authResult.expiresIn*1000)

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
    this.idToken = null
    this.idTokenExpiresAt = null
    this.accessToken = null
    this.accessTokenExpiresAt = null

    this.logoutCallback({ loggedIn: false })
  }

  getProfile = () => {
    return this.userProfile
  }

  isIdTokenValid = () => {
    return tokenValidator(this.idToken, this.idTokenExpiresAt)
  }

  getIdToken = () => {
    if (!this.isIdTokenValid()) {
      this.renewAuthentication()
    }

    return this.idToken
  }

  isAccessTokenValid = () => {
    return tokenValidator(this.accessToken, this.accessTokenExpiresAt)
  }

  getAccessToken = () => {
    if (!this.isAccessTokenValid()) {
      this.renewAuthentication()
    }

    return this.accessToken
  }
}

export default new Auth()
