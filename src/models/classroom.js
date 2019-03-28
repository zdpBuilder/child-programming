import * as classroomService from '@/services/classroom';
import * as schoolService from '@/services/school';
import globalData from '@/utils/globalData';

export default {
  namespace: 'classroom',

  state: {
    list: [],
    pagination: globalData.initPagination,
    schoolSelectData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(classroomService.getList, payload);
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

    *fetchSchoolInfoList({ payload }, { call, put }) {
      const response = yield call(schoolService.getSchoolInfoSelect, payload);
      yield put({
        type: 'save',
        payload: {
          schoolSelectData: response || [],
        },
      });
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(classroomService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(classroomService.deleteBatch, payload);
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
