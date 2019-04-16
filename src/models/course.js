import * as courseService from '@/services/course';
import { getGradeInfoSelect } from '@/services/grade';
import globalData from '@/utils/globalData';

export default {
  namespace: 'course',

  state: {
    list: [],
    pagination: globalData.initPagination,
    gradeSelectData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(courseService.getList, payload);
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

    *fetchGradeInfoList({ payload, callback }, { call, put }) {
      const response = yield call(getGradeInfoSelect, payload);
      yield put({
        type: 'save',
        payload: {
          gradeSelectData: response || [],
        },
      });
      if (callback) callback();
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(courseService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(courseService.deleteBatch, payload);
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
