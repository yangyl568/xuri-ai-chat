import axios from "axios";

/**
 * 处理并下载文件
 * @param {Blob} blob - 文件数据
 * @param {string} disposition - content-disposition 响应头
 * @returns {string|false} 文件名或 false（失败）
 */
function handleFileDownload(blob, disposition) {
  try {
    let filename = "下载文件";
    if (disposition) {
      // 兼容多种 filename 格式
      const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i);
      if (match) filename = decodeURIComponent(match[1]);
    }
    if (window.URL && window.URL.createObjectURL) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return filename;
    } else {
      console.error("当前浏览器不支持文件下载");
      return false;
    }
  } catch (e) {
    console.error("文件下载失败", e);
    return false;
  }
}

// 工厂函数：创建 axios 实例和 http 方法
function createHttp({ baseURL = "/api", timeout = 10000, ...restConfig } = {}) {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
    ...restConfig,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      const contentType = response.headers["content-type"] || "";
      // 判断是否为常见的文件流类型
      if (
        /(multipart\/form-data|application\/octet-stream|application\/pdf|application\/zip|application\/msword|application\/vnd)/i.test(contentType)
      ) {
        // 处理后端返回错误信息但 content-type 错误的情况
        if (response.data instanceof Blob) {
          // 尝试判断 blob 是否为 json 错误信息
          if (contentType.includes("application/json")) {
            // 读取 blob 内容
            return response.data.text().then(text => {
              try {
                const json = JSON.parse(text);
                // 这里可以自定义错误处理
                console.error("下载接口返回错误：", json.message || json);
                return Promise.reject(json);
              } catch {
                // 不是 json，继续下载
                const filename = handleFileDownload(response.data, response.headers["content-disposition"]);
                if (filename) {
                  return { downloaded: true, filename };
                } else {
                  return Promise.reject(new Error("文件下载失败"));
                }
              }
            });
          } else {
            // 正常文件流
            const filename = handleFileDownload(response.data, response.headers["content-disposition"]);
            if (filename) {
              return { downloaded: true, filename };
            } else {
              return Promise.reject(new Error("文件下载失败"));
            }
          }
        }
      }
      // 普通数据
      return response.data;
    },
    (error) => {
      if (error.response) {
        const msg = error.response.data?.message || "请求失败";
        console.error(msg);
      } else if (error.request) {
        console.error("无响应，请检查网络");
      } else {
        console.error("请求出错", error.message);
      }
      return Promise.reject(error);
    }
  );

  // 常用方法
  return {
    get(url, params = {}, config = {}) {
      // 如果需要下载文件，需设置 responseType: 'blob'
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
export { createHttp, handleFileDownload };
