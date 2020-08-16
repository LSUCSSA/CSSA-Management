import React from 'react';
import {PageLoading} from '@ant-design/pro-layout';
import {Redirect, connect, ConnectProps} from 'umi';
import {stringify} from 'querystring';
import {ConnectState} from '@/models/connect';
import {CurrentUser} from '@/models/user';
import io from 'socket.io-client';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const {dispatch, currentUser} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }

  }

  render() {
    const {isReady} = this.state;
    const {children, loading, currentUser, dispatch} = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = currentUser && currentUser.id;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading/>;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`}/>;
    }
    if (isLogin && dispatch) {
      const socket = io(`${SERVER_URL}/cssa`, {query: `userID=${currentUser.id}`});
      socket.on('connect', () => {
        dispatch({type: "global/setSocket", payload: socket})
      });
      socket.on('disconnect', () => {
        socket.removeAllListeners();
      });
    }

    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
