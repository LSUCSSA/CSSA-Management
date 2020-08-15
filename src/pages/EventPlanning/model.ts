import { getKanbanData, setKanbanData } from '@/services/eventPlanning';

import { Effect, Reducer } from 'umi';

export interface EventPlanningCompType {
  board: object;
  isSocket: boolean;
  // currentBoardId: string,
}

export interface EventPlanningModelType {
  namespace: string;
  state: EventPlanningCompType;
  effects: {
    getKanban: Effect;
    setKanban: Effect;
    PUT_BOARD_ID_IN_REDUX: Effect;
    MOVE_LIST: Effect;
    MOVE_CARD: Effect;
  };
  reducers: {
    setKanbanData: Reducer<EventPlanningCompType>;
    setBoardId: Reducer<EventPlanningCompType>;
  };
}

const eventPlanningModel: EventPlanningModelType = {
  namespace: 'eventPlanning',
  state: {
    board: {},
    isSocket: false,
    shouldUpdate: false,
    // currentBoardId: '',
  },
  effects: {
    *getKanban(_, { call, put }) {
      const response = yield call(getKanbanData);
      yield put({
        type: 'setKanbanData',
        payload: {...response, shouldUpdate: false},
      });
    },
    *setKanban({ payload }, { call, put }) {
      // console.log(payload);
      let response;
      if (payload.shouldUpdate) {
        response = yield call(setKanbanData, payload);
      }
      yield put({
        type: 'setKanbanData',
        payload: response || payload,
      });
    },
  },
  reducers: {
    setKanbanData(state: EventPlanningCompType, { payload, type }) {
      return {...state, board: payload.kanbanData, type};
    },
  },
};
export default eventPlanningModel;
