import request from '../utils/request';
import { apiServerUrl } from '../urls';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(apiServerUrl.concat('/api/currentUser'));
}
