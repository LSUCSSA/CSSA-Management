import request from '@/utils/request';
import {TableListParams} from "@/pages/Roster/data";

export async function updateMember(id:string, params: TableListParams) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    data: params
  });
}
export async function getPositionList(params: object) {
  return request('/api/getpositionlist', {
    params,
  });
}
export async function getRoster(params: object) {
  return request('/api/fetchRoster', {
    params,
  });
}
export async function addMember(params: TableListParams) {
  return request('/api/users', {
    method: 'POST',
    data: params,
  });
}

export async function removeMembers(params: object) {
  return request(`/api/bulkDestroy`, {
    method: 'POST',
    data: params,
  });
}
export async function removeMember(id: string) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

export async function updatePoint(param: object) {
  return request(`/api/users/${param.id}`, {
    method: 'PUT',
    data: {points: param.currPoint + param.point2Update}
  });
}

export async function batchUpdateUsers(param: object) {
  return request(`/api/batchUpdateUsers`, {
    method: 'POST',
    data: {IDs: param.IDs, fields: ['points'], updateData: {points: param.point2Update}}
  });
}
