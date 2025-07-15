import axios from 'axios';

// 工厂函数：创建 axios 实例和 http 方法
function createHttp({ baseURL = '/api', timeout = 10000, ...restConfig } = {}) {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
    ...restConfig,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        const msg = error.response.data?.message || '请求失败';
        console.error(msg);
      } else if (error.request) {
        console.error('无响应，请检查网络');
      } else {
        console.error('请求出错', error.message);
      }
      return Promise.reject(error);
    }
  );

  // 常用方法
  return {
    get(url, params = {}, config = {}) {
      return instance.get(url, { params, ...config });
    },
    post(url, data = {}, config = {}) {
      return instance.post(url, data, config);
    },
    put(url, data = {}, config = {}) {
      return instance.put(url, data, config);
    },
    delete(url, params = {}, config = {}) {
      return instance.delete(url, { params, ...config });
    },
    instance,
  };
}

// 默认实例（可直接用）
const http = createHttp();

export default http;
export { createHttp }; 