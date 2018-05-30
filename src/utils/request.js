import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { getAccessToken } from './authority';

const codeMessage = {
  200: 'Server successfully return the requested data.',
  201: 'The success of new or modified data.',
  202: 'A request has been queued into the background (asynchronous task).',
  204: 'Delete data successfully.',
  400: 'Requests made a mistake, or the server does not modify the operation of the new data.',
  401: 'The user does not have permission (Token, username, password error).',
  403: 'The user is authorized, but access is prohibited.',
  404: 'Requests for the recording does not exist, the server does not operate.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will no longer be available.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred on the server. Please check the server.',
  502: 'Bad gateway.',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained.',
  504: 'Gateway timed out.',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `Request Error ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // const defaultOptions = {
  //   credentials: 'include',
  // };
  // const newOptions = { ...defaultOptions, ...options };
  const newOptions = { ...options };
  if (getAccessToken()) {
    const authorizationHeader = { Authorization: 'Bearer '.concat(getAccessToken()) };
    newOptions.headers = {
      ...newOptions.headers,
      ...authorizationHeader,
    };
  }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        // logout session needs the access token; since we are detecting user via token
        if (getAccessToken()) {
          dispatch({
            type: 'login/logout',
          });
        }
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
