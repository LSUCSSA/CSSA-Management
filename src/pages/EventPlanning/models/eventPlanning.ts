import {getKanbanData, setKanbanData} from '@/services/eventPlanning';

import {Effect, Reducer} from 'umi';

export interface EventPlanningCompType {
  board: object,
  currentBoardId: string,
  eventBus: null | Function
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
    currentBoardId: '',
    eventBus: null,
  },
  effects: {
    * getKanban(_, {call, put}) {
      const response = yield call(getKanbanData);
      yield put({
        type: 'setKanbanData',
        payload: response,
      });
    },
    * setKanban({payload}, {call, put}) {
      let response;
      if(!payload.isSocket){
        response = yield call(setKanbanData, payload);
      }
      yield put({
        type: 'setKanbanData',
        payload: response || payload,
      });
    },
    * eventBus({payload}, {call, put}) {
      yield put({
        type: 'setEventBus',
        payload,
      });
    },
  },
  reducers: {
    setKanbanData(state: EventPlanningCompType, {payload, type}) {
      return {...state, board: payload.kanbanData, type};
    },
    setBoardId(state: EventPlanningCompType, {payload, type}) {
      return {...state, currentBoardId: payload.boardId, type};
    },
    setEventBus(state: EventPlanningCompType, {payload, type}) {
      return {...state, eventBus: payload, type};
    },
  },
};
export default eventPlanningModel;
