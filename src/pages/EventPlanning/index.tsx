import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
// import Board from './KanbanBoard/Board/Board';
import Board from 'react-trello';
import { connect } from 'umi';
import io from 'socket.io-client';
import styles from './index.less';
import data from './mock';
import Card from './KanbanBoard/Card';
import BoardContext from './KanbanBoard/context';

// import Header from "@/pages/EventPlanning/KanbanBoard/Header";
const socket = io(`${SERVER_URL}/cssa`);
const EventPlanning = ({ dispatch, board, isSocket }) => {
  const [eventBus, setEventBus] = useState();
  const [shouldUpdate, setUpdate] = useState(true);
  const setKanbanDispatch = (data, socket) =>
    dispatch({
      type: 'eventPlanning/setKanbangit',
      payload: { kanbanData: data, isSocket: socket },
    });
  useEffect(() => {
    dispatch({
      type: 'eventPlanning/getKanban',
    });
  }, []);
  useEffect(() => {
    socket.on('connect', () => {
      socket.on('newKanbanData', (data) => {
        // console.log(data);
        console.log(socket.id);
        setUpdate(false);
        setKanbanDispatch(JSON.parse(data), true);
      });
    });
    // return socket.disconnect()
  }, []);

  const shouldReceiveNewData = (data) => {
    if (!shouldUpdate) {
      setUpdate(true);
    } else {
      setKanbanDispatch(data, false);
    }
  };
  console.log(shouldUpdate);
  // if(eventBus){
  //   eventBus.publish({type: 'ADD_CARD', laneId: 'GOAL', card: {id: "M1", title: "Buy Milk", label: "15 mins", body: "Also set reminder"}})
  // }
  // const boardData = {lists: board.lists, boardTitle: board.title, boardId: board._id, boardColor: board.color };
  if (Object.keys(board).length > 0) {
    return (
      <PageHeaderWrapper className={styles.main}>
        <BoardContext.Provider value={{ eventBus, dispatch: setKanbanDispatch, data: board }}>
          <Board
            data={board}
            draggable
            canAddLanes
            editLaneTitle
            id="EditableBoard1"
            onDataChange={shouldReceiveNewData}
            eventBusHandle={setEventBus}
            // onCardDelete={handleCardDelete}
            // onCardAdd={handleCardAdd}
            components={{ Card }}
            editable
          />
        </BoardContext.Provider>
      </PageHeaderWrapper>
    );
  }
  return <Spin spinning={Object.keys(board).length === 0} />;
};

export default connect(({ eventPlanning }) => ({
  board: eventPlanning.board,
  isSocket: eventPlanning.isSocket,
}))(EventPlanning);
