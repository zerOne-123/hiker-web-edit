export default async (url, config = {}) => {
  // 如果是 post 请求，那么 content-type 默认设为 application/x-www-form-urlencoded
  if (config.method?.toLocaleLowerCase() === 'post') {
    if (!config.headers) {
      config.headers = { 'content-type': 'application/x-www-form-urlencoded' };
    } else if (!config.headers['content-type']) {
      config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }
  // console.log(config);
  const res = await chrome.runtime.sendMessage({ url, config });
  // console.log(res);
  if (res.success) {
    return res.res;
  } else {
    throw new Error(res.err);
  }
};
