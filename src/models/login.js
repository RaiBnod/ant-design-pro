import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout } from '../services/api';
import {
  setAuthority,
  setAccessToken,
  setRefreshToken,
  removeAuthority,
  removeAccessToken,
  removeRefreshToken,
} from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // const response = '';
      yield put({
        type: 'changeLoginStatus',
        payload: {
          ...response,
          currentAuthority: 'admin',
          status: response && response.access_token ? true : 'error',
        }, // TODO: Defining role
      });
      // Login successfully
      if (response && response.access_token) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { call, put, select }) {
      yield call(accountLogout);
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.access_token && payload.refresh_token) {
        setAccessToken(payload.access_token);
        setRefreshToken(payload.refresh_token);
        setAuthority(payload.currentAuthority);
      } else {
        removeAccessToken();
        removeRefreshToken();
        removeAuthority();
      }
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
