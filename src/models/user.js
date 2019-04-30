import * as teacherService from '@/services/teacher';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch({ payload, callback }, { call }) {
      const response = yield call(teacherService.save, payload);

      if (callback) callback(response);
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(teacherService.getTeacherByLoginId, {
        loginId: JSON.parse(window.sessionStorage.getItem('currentUserInfo')).loginId,
      });

      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
