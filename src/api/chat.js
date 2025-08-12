import http from './http';

export const chatApi = (data) => {
  return http.post('https://api.siliconflow.cn/v1/chat/completions', data, {
    headers: {
      'Authorization': `Bearer ${process.env.SILICONFLOW}`,
    },
  });
}
