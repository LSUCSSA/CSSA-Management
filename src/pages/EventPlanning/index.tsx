import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import Board from 'react-trello';
import styles from './index.less';
import data from './mock';

export default () => {
  const shouldReceiveNewData = (data) => {
    console.log(data);
  };
  return (
    <PageHeaderWrapper className={styles.main}>
      <Board
        data={data}
        draggable
        canAddLanes
        editLaneTitle
        id="EditableBoard1"
        onDataChange={shouldReceiveNewData}
        // onCardDelete={handleCardDelete}
        // onCardAdd={handleCardAdd}
        // onCardClick={(cardId, metadata, laneId) =>
        //   alert(`Card with id:${cardId} clicked. Card in lane: ${laneId}`)
        // }
        editable
      />
    </PageHeaderWrapper>
  );
};
