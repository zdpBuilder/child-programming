import * as signUpFormalCourseService from '@/services/signUpFormalCourse';
import globalData from '@/utils/globalData';

export default {
  namespace: 'signUpFormalCourse',

  state: {
    list: [],
    pagination: globalData.initPagination,
    roleListData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(signUpFormalCourseService.getList, payload);
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
      const response = yield call(signUpFormalCourseService.deleteBatch, payload);
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
