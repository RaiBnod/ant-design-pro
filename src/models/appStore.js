import { installApp, uninstallApp } from '../services/api';

export default {
  namespace: 'appStore',

  state: {
    apps: [],
  },

  effects: {
    *installApp({ payload, callback }, { call, put }) {
      const response = yield call(installApp, payload);
      yield put({
        type: 'install',
        payload: response,
      });
      if (callback) yield callback(response);
    },

    *uninstallApp({ payload, callback }, { call, put }) {
      const response = yield call(uninstallApp, payload);
      yield put({
        type: 'uninstall',
        payload: response,
      });
      if (callback) yield callback(response);
    },
  },

  reducers: {
    install(state, action) {
      return {
        ...state,
        apps: action.payload,
      };
    },
    uninstall(state, action) {
      return {
        ...state,
        apps: action.payload,
      };
    },
  },
};
