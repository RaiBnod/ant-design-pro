import { stringify } from 'qs';
import request from '../utils/request';
import { apiUrl, apiServerUrl } from '../urls';
import { getRefreshToken } from '../utils/authority';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function installApp(params) {
  return request(apiUrl.concat('/api/store/install'), {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function uninstallApp(params) {
  return request(apiUrl.concat('/api/store/uninstall'), {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function accountLogin(params) {
  return request(apiServerUrl.concat('/api/login/account'), {
    method: 'POST',
    body: params,
  });
}

export async function accountLogout() {
  return request(apiServerUrl.concat('/api/logout'), {
    method: 'POST',
    body: { refresh_token: getRefreshToken() },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
