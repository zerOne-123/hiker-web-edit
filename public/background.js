// const defaultTimeout = 10000;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { url, config } = request;
  if (config.headers) {
    const requestHeaders = Object.entries(config.headers).map(([header, value]) => ({
      header,
      operation: 'set',
      value,
    }));
    if (requestHeaders) {
      chrome.declarativeNetRequest.updateSessionRules(
        {
          addRules: [
            {
              id: 1,
              priority: 1,
              action: {
                type: 'modifyHeaders',
                requestHeaders,
              },
              condition: {
                urlFilter: url,
                resourceTypes: ['xmlhttprequest'],
              },
            },
          ],
          removeRuleIds: [1],
        },
        () => {}
      );
    }
  }
  fetch(url, config)
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch');
      return {
        url: res.url,
        data: await res.text(),
      };
    })
    .then((res) => {
      sendResponse({ success: true, res });
    })
    .catch((err) => {
      sendResponse({ success: false, err: err.message });
    });
  return true;
});