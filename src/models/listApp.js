export default {
  namespace: 'listApp',

  state: {
    listApp: [],
  },

  effects: {
    *fetch(_, { put }) {
      yield put({
        type: 'queryList',
        payload: [
          {
            id: 1,
            title: 'JDBC Example1',
            description: 'Here we have a Nube JDBC Engine example1, we can store apps like this',
            install: {
              groupId: 'io.nubespark',
              artifactId: 'nube-jdbc-engine',
              version: '1.0-SNAPSHOT',
            },
            uninstall: {
              artifactId: 'nube-jdbc-engine',
            },
          },
          {
            id: 2,
            title: 'Nube Edge Ditto Driver',
            description: 'Nube Edge Ditto Driver App is available here.',
            install: {
              groupId: 'io.nubespark',
              artifactId: 'nube-edge-ditto-driver',
              version: '1.0-SNAPSHOT',
            },
            uninstall: {
              artifactId: 'nube-edge-ditto-driver',
            },
          },
          {
            id: 3,
            title: 'Nube Server Ditto Driver',
            description: 'Nube Server Ditto Driver App is available here.',
            install: {
              groupId: 'io.nubespark',
              artifactId: 'nube-server-ditto-driver',
              version: '1.0-SNAPSHOT',
            },
            uninstall: {
              artifactId: 'nube-server-ditto-driver',
            },
          },
        ],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        listApp: action.payload,
      };
    },
  },
};
