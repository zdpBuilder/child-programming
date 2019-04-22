import * as signUpExperienceCourseService from '@/services/signUpExperienceCourse';
import globalData from '@/utils/globalData';

export default {
  namespace: 'signUpExperienceCourse',

  state: {
    list: [],
    pagination: globalData.initPagination,
    roleListData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(signUpExperienceCourseService.getList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || [],
          pagination: {
            total: response ? response.length : 0,
          },
        },
      });
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(signUpExperienceCourseService.deleteBatch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
