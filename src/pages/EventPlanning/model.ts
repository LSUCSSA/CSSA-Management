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
    // currentBoardId: '',
  },
  effects: {
    *getKanban(_, { call, put }) {
      const response = yield call(getKanbanData);
      yield put({
        type: 'setKanbanData',
        payload: response,
      });
    },
    *setKanban({ payload }, { call, put }) {
      let response;
      if (!payload.isSocket) {
        response = yield call(setKanbanData, payload);
        response = { ...response, isSocket: payload.isSocket };
      }
      yield put({
        type: 'setKanbanData',
        payload: response || payload,
      });
    },
  },
  reducers: {
    setKanbanData(state: EventPlanningCompType, { payload, type }) {
      return { ...state, board: payload.kanbanData, isSocket: payload.isSocket, type };
    },
  },
};
export default eventPlanningModel;
