import { getSponsorComp, setSponsorComp, uploadSlide, getSlide } from '@/services/editor';

import { Effect, Reducer } from 'umi';

export interface SponsorCompType {
  sponsorsList: {
    numRow: number;
    numCol: number;
    fileData: object | null;
  };
  slideList: Array<object>;
}

export interface EditorModelType {
  namespace: string;
  state: SponsorCompType;
  effects: {
    getSponsorList: Effect;
    getHomeSlide: Effect;
    uploadSponsorList: Effect;
    uploadHomeSlide: Effect;
  };
  reducers: {
    setSponsorList: Reducer<SponsorCompType>;
  };
}

const editorModel: EditorModelType = {
  namespace: 'editor',
  state: {
    sponsorsList: {
      numRow: 3,
      numCol: 3,
      fileData: null,
    },
    slideList: [],
  },
  effects: {
    *getSponsorList(_, { call, put }) {
      const response = yield call(getSponsorComp);
      yield put({
        type: 'setSponsorList',
        payload: response,
      });
    },
    *uploadSponsorList({ payload }, { call, put }) {
      const response = yield call(setSponsorComp, payload);
      yield put({
        type: 'setSponsorList',
        payload: response,
      });
    },
    *getHomeSlide(_, { call, put }) {
      const response = yield call(getSlide);
      yield put({
        type: 'setSlide',
        payload: response,
      });
    },
    *uploadHomeSlide({ payload }, { call, put }) {
      const response = yield call(uploadSlide, payload);
      yield put({
        type: 'setSlide',
        payload: response,
      });
    },
  },
  reducers: {
    setSponsorList(state: SponsorCompType, { payload, type }) {
      return { ...state, sponsorsList: JSON.parse(payload.sponsorsList), type };
    },
    setSlide(state, action) {
      return { ...state, slideList: action.payload.slider };
    },
  },
};
export default editorModel;
