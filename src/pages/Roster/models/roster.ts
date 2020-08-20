import {getPositionList, getRoster, removeMembers, updateMember, updatePoint} from '@/services/roster';
import {Effect, Reducer} from 'umi';

export interface MemberType {
  confirmed: boolean;
  blocked: boolean;
  position: string;
  department: string;
  points: number;
  name: string;
  username: string;
  email: string;
  provider: string;
}

export interface StateType {
  positionList: {
    position: Array<string>;
    department: Array<string>;
  };
  roster: Array<MemberType>;
  removeMemberStatus: boolean;
}

export interface RosterModelType {
  namespace: string;
  state: StateType;
  effects: {
    getPositionList: Effect;
    getRosters: Effect;
    removeMembers: Effect;
    updateMember: Effect;
    updatePoints: Effect;
  };
  reducers: {
    setPositionList: Reducer<StateType>;
    setRoster: Reducer<StateType>;
  };
}

const rosterModel: RosterModelType = {
  namespace: 'roster',
  state: {
    positionList: {
      position: [],
      department: [],
    },
    roster: [],
    removeMemberStatus: false,
  },
  effects: {
    * getPositionList(_, {call, put}) {
      const response = yield call(getPositionList);
      yield put({
        type: 'setPositionList',
        payload: response,
      });
    },
    * getRosters(_, {call, put}) {
      const response = yield call(getRoster, {_sort: 'points:DESC'});
      yield put({
        type: 'setRoster',
        payload: response,
      });
    },
    * removeMembers({payload}, {call, put}) {
      const response = yield call(removeMembers, payload);
      yield put({
        type: 'setRemoveMemberStatus',
        payload: response,
      });
    },
    * updateMember({payload}, {put, call, select}) {
      const response = yield call(updateMember, payload.id, {...payload});
      const roster = yield select((state) => state.roster.roster);
      const newRoster = roster.map(member => {
        if (member.id === payload.id)
          return response;
        return member
      });
      yield put({
        type: 'setRoster',
        payload: newRoster
      })

    },
    * updatePoints({payload}, {call, put, select}) {
      const response = yield call(updatePoint, {
        id: payload.id,
        currPoint: payload.currPoint,
        point2Update: payload.point2Update
      });
      const roster = yield select((state) => state.roster.roster);
      const newRoster = roster.map(member => {
        if (member.id === payload.id)
          return {...member, points: response.points};
        return member
      });
      yield put({
        type: 'setRoster',
        payload: newRoster
      })
      // yield put({
      //   type: 'user/setPoints',
      //   payload: response
      // })
    },
  },
  reducers: {
    setPositionList(state: StateType, {payload, type}) {
      return {...state, positionList: payload, type};
    },
    setRoster(state: StateType, {payload, type}) {
      return {...state, roster: payload, type};
    },
    setRemoveMemberStatus(state: StateType, {payload, type}) {
      return {...state, removeMemberStatus: payload, type};
    },
  },
};
export default rosterModel;
