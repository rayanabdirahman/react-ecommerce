import { API_BASE_URL, JWT_COOKIE_NAME } from "../config";
import { ILoginModel, ISignUpModel } from "../domain/interfaces";

const API_LOGIN = `${API_BASE_URL}/auth/login`
const API_LOGOUT = `${API_BASE_URL}/auth/logout`
const API_SIGNUP = `${API_BASE_URL}/auth/signup`

/**
 * Log user in by sending state values to backend api
 * @param { ILoginModel } user - stores required user credentials for login
 */
export const login = async(user: ILoginModel) => {
  try {
    const loginModel: ILoginModel = {
      ...user
    }
  
    let response = await fetch(`${API_LOGIN}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginModel)
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`LoginPage:login=>>>>>> Error when signing up user: ${error}`)
  }
}

/**
 * Log user out by removing user details from local storage
 * @param { Function } next - callback function to be executed when user credentials have been stored
 */
export const logout = async(next: Function) => {
  try {
    // thorw error if local storage is not available on browse
    if (typeof window === 'undefined') {
      throw Error('Local storage is not availbale on this browser');
    }
    
    // remove user details from local storage
    localStorage.removeItem(JWT_COOKIE_NAME)

    // execute callback function
    next()

    // make API request to log user out
    let response = await fetch(`${API_LOGOUT}`, {
      method: 'GET',
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`LoginPage:login=>>>>>> Error when signing up user: ${error}`)
  }
}


/**
 * Register user by sending state values to backend api
 * @param { ISignUpModel } user - stores required user credentials for signup
 */
export const signUp = async(user: ISignUpModel) => {
  try {
    const signUpModel: ISignUpModel = {
      ...user
    }
  
    let response = await fetch(`${API_SIGNUP}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUpModel)
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`SignUpPage:signUp=>>>>>> Error when signing up user: ${error}`)
  }
}

/**
 * Store JWT Token in localstorage
 * @param { object } data - stores response data from api calls
 * @param { Function } next - callback function to be executed when user credentials have been stored
 */
export const authenticate = (data: object, next: Function) => {
  // check if local storage is available on browser
  if (typeof window !== 'undefined') {
    localStorage.setItem(JWT_COOKIE_NAME, JSON.stringify(data))
    next()
  }
}

/**
 * Return whether user is authenticated or not
 */
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    // check if user details is stored in localstorage
    if (localStorage.getItem(JWT_COOKIE_NAME)) {
      return JSON.parse(`${localStorage.getItem(JWT_COOKIE_NAME)}`)
    }
  }

  // return false if user details are not available
  return false;    
}
