import * as studentScheduleService from '@/services/studentSchedule';
import { getGradeInfoSelect } from '@/services/grade';

export default {
  namespace: 'studentSchedule',

  state: {
    list: [],
    gradeSelectData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(studentScheduleService.getList, payload);
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

    *fetchGradeInfoList({ payload }, { call, put }) {
      const response = yield call(getGradeInfoSelect, payload);
      yield put({
        type: 'save',
        payload: {
          gradeSelectData: response || [],
        },
      });
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
