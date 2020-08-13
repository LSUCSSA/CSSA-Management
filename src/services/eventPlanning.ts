import request from '@/utils/request';

export async function getKanbanData() {
  return request(`/api/event-kanban`, {
    method: 'GET',
  });
}
export async function setKanbanData(params) {
  return request(`/api/event-kanban`, {
    method: 'PUT',
    data: params,
  });
}
