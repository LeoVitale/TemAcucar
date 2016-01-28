import React, { NativeModules } from 'react-native'
const FBLoginManager = NativeModules.FBLoginManager
import Keychain from 'react-native-keychain'

import Config from "../Config"
import { parseError } from './BasicActions'

export function authHeaders(credentials) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Token': credentials.accessToken,
    'Expiry': credentials.expiry,
    'Token-Type': credentials.tokenType,
    'Uid': credentials.uid,
    'Client': credentials.client,
  }
}

export function authCredentials(response) {
  return {
    accessToken: response.headers.get('access-token'),
    client: response.headers.get('client'),
    expiry: response.headers.get('expiry'),
    tokenType: response.headers.get('token-type'),
    uid: response.headers.get('uid'),
  }
}

export function authGetUser(user) {
  return dispatch => {
    if (user) 
      return
    dispatch({ type: 'AUTH_GET_USER_REQUEST' })
    Keychain
    .getInternetCredentials(Config.apiUrl)
    .then((credentials) => {
      if (credentials.username && credentials.username.length > 0 && credentials.password && credentials.password.length > 0) {
        dispatch({
          type: 'AUTH_GET_USER_SUCCESS',
          user: {
            email: credentials.username,
            password: credentials.password,
          },
        })
      } else {
        dispatch({
          type: 'AUTH_GET_USER_FAILURE',
          error: {
            id: 'invalid_internet_credentials',
            message: 'Invalid internet credentials.',
          },
        })
      }
    })
    .catch(error => {
      FBLoginManager.getCredentials(function(facebookError, data){
        if (!facebookError) {
          dispatch({
            type: 'AUTH_GET_USER_SUCCESS',
            user: {
              facebook: data.credentials,
            },
          })
        } else {
          dispatch({
            type: 'AUTH_GET_USER_FAILURE',
            error,
          })
        }
      })
    })
  }
}

function authSetUser(dispatch, user) {
  if (user) {
    dispatch({
      type: 'AUTH_SET_USER_REQUEST',
      user,
    })
    Keychain
    .setInternetCredentials(Config.apiUrl, user.email, user.password)
    .then(() => {
      dispatch({
        type: 'AUTH_SET_USER_SUCCESS',
        user,
      })
    })
    .catch(error => {
      dispatch({
        type: 'AUTH_SET_USER_FAILURE',
        error,
      })
    })
  }
}

function authResetUser(dispatch) {
  dispatch({ type: 'AUTH_RESET_USER_REQUEST'})
  Keychain
  .resetInternetCredentials(Config.apiUrl)
  .then(() => {
    FBLoginManager.logout((error, data) => {
      if (error) {
        dispatch({
          type: 'AUTH_RESET_USER_FAILURE',
          error,
        })
      }
    })
  })
  .then(() => dispatch({ type: 'AUTH_RESET_USER_SUCCESS' }))
  .catch(error => {
    dispatch({
      type: 'AUTH_RESET_USER_FAILURE',
      error,
    })
  })
}

export function authSignIn(user) {
  return dispatch => {
    if (user.email && user.password) {
      dispatch(authEmail(user))
    } else if (user.facebook) {
      dispatch(authFacebook())
    }
  }
}

export function authSignUp(user) {
  return dispatch => {
    dispatch({
      type: 'AUTH_SIGN_UP_REQUEST',
      user,
    })
    fetch(`${Config.apiUrl}/users`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
      })
    })
    .then(response => {
      if(response.ok) {
        const credentials = authCredentials(response)
        dispatch({
          type: 'AUTH_SIGN_UP_SUCCESS',
          user: JSON.parse(response._bodyText),
          credentials,
        })
        return user
      } else {
        const error = parseError(response)
        dispatch({
          type: 'AUTH_SIGN_UP_FAILURE',
          error,
        })
      }
    })
    .then((user) => authSetUser(dispatch, user))
    .catch(error => {
      dispatch({
        type: 'AUTH_SIGN_UP_FAILURE',
        error,
      })
    })
  }  
}

export function authFacebook() {
  return dispatch => {
    FBLoginManager.loginWithPermissions(["public_profile", "email", "user_friends", "user_about_me"], (facebookError, data) => {
      if (!facebookError) {
        const facebook = data.credentials
        dispatch({
          type: 'AUTH_FACEBOOK_REQUEST',
          user: { facebook },
        })
        fetch(`${Config.apiUrl}/authentications`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            facebook_token: facebook.token,
          })
        })
        .then(response => {
          if(response.ok) {
            const credentials = authCredentials(response)
            const user = JSON.parse(response._bodyText)
            dispatch({
              type: 'AUTH_FACEBOOK_SUCCESS',
              user,
              credentials,
            })
          } else {
            const error = parseError(response)
            dispatch({
              type: 'AUTH_FACEBOOK_FAILURE',
              error,
            })
          }
        })
        .catch(error => {
          dispatch({
            type: 'AUTH_FACEBOOK_FAILURE',
            error,
          })
        })
      } else {
        dispatch({
          type: 'AUTH_FACEBOOK_FAILURE',
          error,
        })
      }
    })
  }  
}

function authEmail(user) {
  return dispatch => {
    dispatch({
      type: 'AUTH_SIGN_IN_REQUEST',
      user,
    })
    fetch(`${Config.apiUrl}/authentications`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      })
    })
    .then(response => {
      if(response.ok) {
        const credentials = authCredentials(response)
        dispatch({
          type: 'AUTH_SIGN_IN_SUCCESS',
          user: JSON.parse(response._bodyText),
          credentials,
        })
        return user
      } else {
        const error = parseError(response)
        dispatch({
          type: 'AUTH_SIGN_IN_FAILURE',
          error,
        })
      }
    })
    .then((user) => authSetUser(dispatch, user))
    .catch(error => {
      dispatch({
        type: 'AUTH_SIGN_IN_FAILURE',
        error,
      })
    })
  }  
}

export function authSignOut(credentials) {
  return dispatch => {
    dispatch({ type: 'AUTH_SIGN_OUT_REQUEST' })
    fetch(`${Config.apiUrl}/authentications`, {
      method: 'delete',
      headers: authHeaders(credentials)
    })
    .then(response => {
      if(response.ok) {
        dispatch({ type: 'AUTH_SIGN_OUT_SUCCESS' })
      } else {
        const error = parseError(response)
        dispatch({
          type: 'AUTH_SIGN_OUT_FAILURE',
          error,
        })
      }
    })
    .then(() => authResetUser(dispatch))
    .catch(error => {
      dispatch({
        type: 'AUTH_SIGN_OUT_FAILURE',
        error,
      })
    })
  }  
}

export function authRequestPassword(user) {
  return dispatch => {
    dispatch({
      type: 'AUTH_REQUEST_PASSWORD_REQUEST',
      user,
    })
    fetch(`${Config.apiUrl}/password`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
      })
    })
    .then(response => {
      if(response.ok) {
        dispatch({ type: 'AUTH_REQUEST_PASSWORD_SUCCESS' })
      } else {
        const error = parseError(response)
        dispatch({
          type: 'AUTH_REQUEST_PASSWORD_FAILURE',
          error,
        })
      }
    })
    .catch(error => {
      dispatch({
        type: 'AUTH_REQUEST_PASSWORD_FAILURE',
        error,
      })
    })
  }  
}

export function authResetPassword(user) {
  return dispatch => {
    dispatch({
      type: 'AUTH_RESET_PASSWORD_REQUEST',
      user,
    })
    fetch(`${Config.apiUrl}/password`, {
      method: 'patch',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        token: user.resetPasswordToken,
      })
    })
    .then(response => {
      if(response.ok) {
        const credentials = authCredentials(response)
        dispatch({
          type: 'AUTH_RESET_PASSWORD_SUCCESS',
          user: JSON.parse(response._bodyText),
          credentials,
        })
        return user
      } else {
        const error = parseError(response)
        dispatch({
          type: 'AUTH_RESET_PASSWORD_FAILURE',
          error,
        })
      }
    })
    .then((user) => authSetUser(dispatch, user))
    .catch(error => {
      dispatch({
        type: 'AUTH_RESET_PASSWORD_FAILURE',
        error,
      })
    })
  }  
}
