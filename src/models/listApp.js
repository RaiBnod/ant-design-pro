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
            avatar: '../../../jdbc.jpg',
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
            avatar: '../../../jdbc.jpg',
            title: 'JDBC Example2',
            description: 'Here we have a Nube JDBC Engine example2, we can store apps like this',
            install: {
              groupId: 'io.nubespark',
              artifactId: 'nube-jdbc-engine',
              version: '1.0-SNAPSHOT',
            },
            uninstall: {
              artifactId: 'nube-jdbc-engine',
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
