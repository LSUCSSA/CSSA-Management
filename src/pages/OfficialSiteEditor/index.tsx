import {PageHeaderWrapper} from '@ant-design/pro-layout';
import React, {useState, useEffect} from 'react';
import {Spin} from 'antd';
import {injectIntl} from 'react-intl';
import {connect} from 'umi';
import styles from './index.less';
import Sponsors from './Sponsors';
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {stringify} from 'qs'; // import DragAndDrop from "@/lib/withDragDropContext"

import GuideUpload from './GuideUpload';
import {setGuideID} from '@/services/editor';
import UploadHomeImages from './UploadHomeImages';

const Editor: React.FC = ({
                            dispatch,
                            intl,
                            sponsorsList,
                            isSponsorLoading,
                            isSlideLoading,
                            slideList,
                            homeSlideModelID
                          }) => {
  // const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    dispatch({
      type: 'editor/getSponsorList',
    });
    dispatch({
      type: 'editor/getHomeSlide',
    });
  }, []);

  const submitSponsorList = (value) => {
    dispatch({
      type: 'editor/uploadSponsorList',
      payload: value,
    });
  };
  const uploadImage = (value) => {
    dispatch({
      type: 'editor/uploadHomeSlide',
      payload: value,
    });
  };
  const getImages = () => {
    dispatch({
      type: 'editor/getHomeSlide',
    });
  };

  return (
    <PageHeaderWrapper className={styles.main}>
      <UploadHomeImages
        modelID={homeSlideModelID}
        slideList={slideList}
        upload={uploadImage}
        isLoading={isSlideLoading}
        getImages={getImages}
      />
      <GuideUpload onChangeId={setGuideID}/>
      <Spin
        style={{
          paddingTop: '50%',
          textAlign: 'center',
        }}
        spinning={isSponsorLoading}
        size="large"
      >
        <Sponsors
          sponsorsList={sponsorsList}
          onChange={submitSponsorList}
          isLoading={isSponsorLoading}
        />
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({editor, loading}) => ({
  sponsorsList: editor.sponsorsList,
  slideList: editor.slideList,
  homeSlideModelID: editor.modelID,
  isSponsorLoading: loading.effects['editor/getSponsorList'],
  isSlideLoading: loading.effects['editor/getHomeSlide'],
}))(injectIntl(React.memo(Editor)));
