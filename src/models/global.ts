import {Subscription, Reducer, Effect} from 'umi';

import {NoticeIconData} from '@/components/NoticeIcon';
import {queryNotices} from '@/services/user';
import {ConnectState} from './connect.d';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  socket: object;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    setSocket: Effect;
    appendSocketNotices: Effect;
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    setSocketObj: Reducer<GlobalModelState>;
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    appendNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    socket: {}
  },

  effects: {
    * setSocket({payload}, {put}) {
      yield put({
        type: 'setSocketObj',
        payload,
      });
    },
    * appendSocketNotices({payload}, {put, select}) {
      yield put({
        type: 'appendNotices',
        payload,
      });
      const totalCount: number = yield select(
        (state: ConnectState) => state.global.notices.length,
      );
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount,
          unreadCount,
        },
      });
    },
    * fetchNotices(_, {call, put, select}) {
      const uid: string = yield select(
        (state: ConnectState) => state.user.currentUser.id,
      );
      const data = yield call(queryNotices, uid);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    * clearNotices({payload}, {put, select}) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    * changeNoticeReadState({payload}, {put, select}) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = {...item};
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
  },

  reducers: {
    setSocketObj(state = {notices: [], collapsed: true, socket: {}}, {payload}): GlobalModelState {
      return {
        ...state,
        socket: payload,
      };
    },
    changeLayoutCollapsed(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    appendNotices(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: [...state.notices, payload],
      };
    },
    saveClearedNotices(state = {notices: [], collapsed: true}, {payload}): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({history}): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({pathname, search}): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
