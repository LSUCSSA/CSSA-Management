import request from '@/utils/request';

export async function getSponsorComp() {
  return request(`/api/sponsors`, {
    method: 'GET',
    // data: params,
  });
}
export async function setSponsorComp(params: string) {
  return request(`/api/setSponsorComp`, {
    method: 'PUT',
    data: params,
  });
}

export async function setGuideID(params: object) {
  return request(`/api/newcomer-guide`, {
    method: 'PUT',
    data: params,
  });
}
export async function getSlide() {
  return request(`/api/image-slide`, {
    method: 'GET',
  });
}
export async function uploadSlide(params: object) {
  return request('/api/image-slide', {
    method: 'PUT',
    data: params,
  });
}
