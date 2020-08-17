import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/users/me');
}

export async function queryNotices(uid): Promise<any> {
  return request(`/api/notifications?user=${uid}`);
}
