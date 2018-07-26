import auth0 from 'auth0-js';
import history from '../history';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  userProfile;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.renewAuthentication = this.renewAuthentication.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      } else if (authResult) {
        this.logUserIn(authResult);
      }

      this.goTo('/home');
    });
  }

  renewAuthentication() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (err) {
        this.logout();
      } else if (authResult) {
        this.logUserIn(authResult);
      }
    });
  }

  logUserIn(authResult) {
    this.userProfile = authResult.idTokenPayload;
    localStorage.setItem('loggedIn', 'true');
  }

  logout() {
    this.userProfile = null;
    localStorage.removeItem('loggedIn');

    this.goTo('/home');
  }

  goTo(path) {
    history.replace(path);
  }

  getUserProfile() {
    return this.userProfile;
  }

  isAuthenticated() {
    return localStorage.getItem('loggedIn') === 'true';
  }
}
