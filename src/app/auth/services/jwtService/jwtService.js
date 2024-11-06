/* eslint-disable class-methods-use-this */
import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      },
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');
      return;
    }

    if (access_token) {
      const userData = this.getUserData();
      this.setSession(access_token, JSON.parse(userData));
      this.emit('onLogin', {
        data: {
          ...userData.user,
          displayName: 'Admin',
          photoURL: 'assets/images/avatars/brian-hughes.jpg',
        },
        role: 'admin',
      });
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = (data) => {
    this.emit('onSignUpLoading', true);
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.signUp, data)
        .then((response) => {
          if (response) {
            // this.setSession(response.data.access_token);
            resolve(response);
            console.log(response);
            this.emit(
              'onSignUp',
              response.data,
              response.data.message || 'Sign up success',
              'success',
            );
            this.emit('onSignUpResponse', true);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
          this.emit('onSignUpResponse', false);
          console.log(error);
          this.emit(
            'onSignUp',
            error.response.data,
            error.response.data.message || 'Failed to sign up',
            'error',
          );
        });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    this.emit('onLoginLoading', true);
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.signIn, {
          email,
          password,
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.tokens.access.token, response.data);
            resolve(response.data.user);
            this.emit('onLogin', {
              data: {
                ...response.data.user,
                displayName: 'Admin',
                photoURL: 'assets/images/avatars/brian-hughes.jpg',
              },
              role: 'admin',
            });
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          this.emit('onLoginLoading', false);
          this.emit(
              'onSignUp',
              error.response.data,
              error.response.data.message || 'Failed to Login',
              'error',
          );
          reject(error);
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      const userData = this.getUserData();
      this.emit('onLogin', JSON.parse(userData));
      resolve(JSON.parse(userData));
      // axios
      //   .get(jwtServiceConfig.accessToken, {
      //     data: {
      //       access_token: this.getAccessToken(),
      //     },
      //   })
      //   .then((response) => {
      //     if (response.data.user) {
      //       this.setSession(response.data.access_token);
      //       resolve(response.data.user);
      //     } else {
      //       this.logout();
      //       reject(new Error('Failed to login with token.'));
      //     }
      //   })
      //   .catch((error) => {
      //     this.logout();
      //     reject(new Error('Failed to login with token.'));
      //   });
    });
  };

  getResetPasswordLink = (email) => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.forgotPassword, {
          email,
        })
        .then((response) => {
          this.emit('onSignUpResponse', true);
          return resolve(response);
        })
        .catch((error) => {
          this.emit('onSignUpResponse', false);
          console.log(error);
          this.emit(
            'onSignUp',
            '',
            error.response.data.detail || 'Failed to sign up',
            'error',
          );
          reject(error);
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token, userData) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      localStorage.removeItem('user_data');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };

  getUserData = () => {
    return window.localStorage.getItem('user_data');
  };
}

const instance = new JwtService();

export default instance;
