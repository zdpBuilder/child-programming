import * as experienceCourseService from '@/services/experienceCourse';
import globalData from '@/utils/globalData';

export default {
  namespace: 'experienceCourse',

  state: {
    list: [],
    pagination: globalData.initPagination,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(experienceCourseService.getList, payload);
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

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(experienceCourseService.save, payload);
      yield put({
        type: 'save',
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
