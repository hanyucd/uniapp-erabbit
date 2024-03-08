
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net';

// 添加拦截器
const httpInterceptor: UniApp.InterceptorOptions = {
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url;
    }

    // 2. 请求超时, 默认 60s
    options.timeout = 10000;

    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    };
    
    // console.log(options);
  }
};

uni.addInterceptor('request', httpInterceptor);
uni.addInterceptor('uploadFile', httpInterceptor);

interface IResponse<T> {
  code: string;
  msg: string;
  result: T;
}

// 请求方法
type ReqMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

const httpRequest = <T = any>(url = '', data = {}, method: string = 'get', otherConfig = {}): Promise<IResponse<T>> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: method.toUpperCase() as ReqMethod,
      data,
      ...otherConfig,
      // 响应成功
      success(res) {
        // console.log(res);
        // 状态码 2xx， axios 就是这样设计的
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as IResponse<T>);
          // 401错误  -> 清理用户信息，跳转到登录页
        } else if (res.statusCode === 401) {
          reject(res);
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as IResponse<T>).msg || '请求错误',
          });
          
          reject(res);
        }
      },
      // 响应失败
      fail(error) {
        uni.showToast({ icon: 'none', title: '网络错误，换个网络试试' });
        reject(error);
      }
    });
  });
};

export default httpRequest;
