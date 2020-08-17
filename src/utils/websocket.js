
const WebSocket = (socket, dispatch)=>{
  socket.on('connect', () => {
    dispatch({type: "global/setSocket", payload: socket});

    socket.on("notifications", data =>{
      dispatch({
        type: 'global/appendSocketNotices',
        payload: data
      });
      console.log(data)
    })

  });
  socket.on('disconnect', () => {
    socket.removeAllListeners();
  });
};
export default WebSocket;

