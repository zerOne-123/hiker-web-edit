import { ref, computed, toRaw } from 'vue';
import http from '../../../utils/http.js';
import { default_rule } from '../../../assets/defineConst.js';
// 口令导入
export const useImport = (ruleData, message) => {
  const showImportModal = ref(false);
  const importText = ref('');
  const onImportAfterLeaver = () => {
    importText.value = '';
  };
  const onImportPositiveClick = async () => {
    try {
      let text = importText.value.trim();
      // if (text.startsWith('https://pastebin.com')) {
      //   // 剪切板1
      //   // https://pastebin.com/xV54MTve 小程序：APP聚合X1311
      //   const api_paste_key = text.match(/com\/(\w*)/)[1];
      //   const { data } = await http('https://pastebin.com/api/api_raw.php', {
      //     method: 'post',
      //     body: `api_option=show_paste&api_user_key=c02545bd6fcfc9dcb82b36cd8ac7be61&api_paste_key=${api_paste_key}&api_dev_key=Qs2VjmfmU1Qz-SGdXpUV6fRPquPzR0js`,
      //   });
      //   text = data;
      // } else if (text.startsWith('https://netcut.cn')) {
      //   // 剪切板2
      //   //https://netcut.cn/p/0b9ec5a505e74818 小程序：bili51bili哔哩投屏
      //   const note_id = text.match(/p\/(\w*)/)[1];
      //   const { data } = await http(`https://netcut.cn/api/note/data/?note_id=${note_id}`);
      //   text = JSON.parse(data).data.note_content;
      // } else if (text.startsWith('https://cmd.im')) {
      //   // 剪切板5
      //   // https://cmd.im/b7ji 小程序：lPTV港澳台
      //   const url = text.split(/[ \n]/)[0];
      //   const { data } = await http(url);
      //   // console.log('aa');
      //   text = data.match(/海阔视界规则分享.*/)[0];
      // } else if (text.startsWith('https://pasteme.tyrantg.com')) {
      //   // 剪切板6
      //   // https://pasteme.tyrantg.com/xxxxxx/lyt5gjhfifzbzq44@KamPyI 小程序：lPTV港澳台
      //   const url = text.split(/[ \n]/)[0].replace('xxxxxx', 'api/getContent');
      //   const { data } = await http(url);
      //   text = JSON.parse(data).data;
      // } else if (text.startsWith('https://note.ms')) {
      //   // 剪切板7
      //   // https://note.ms/uazn/x/y 小程序：lPTV港澳台
      //   const url = text.split(/[ \n]/)[0].replace('/x/y', '');
      //   const { data } = await http(url);
      //   text = data.match(/(海阔视界规则分享.*)</)[1];
      // } else if (text.startsWith('https://txtpbbd.cn')) {
      //   // 剪切板9
      //   // https://txtpbbd.cn/a/b/160526xP
      //   const txt_name = text.match(/b\/(\w*)/)[1];
      //   const { data } = await http('https://a6.qikekeji.com/txt/data/detail/', {
      //     method: 'post',
      //     body: `passwork=&txt_name=${txt_name}`,
      //   });
      //   text = JSON.parse(JSON.parse(data).data.txt_content)[0].content;
      // } else if (text.startsWith('https://hassdtebin.com')) {
      //   // 剪切板10
      //   // https://hassdtebin.com/share/a/b/novoxejuto 小程序：ttttttt
      //   // https://hassdtebin.com/share/a/b/faqocowita\r\n\r\n小程序：lPTV港澳台
      //   const url = text.split(/[ \n]/)[0].replace('a/b/', '').replace('hassdtebin', 'hastebin');
      //   const { data } = await http(url);
      //   text = data.match(/"text":"(.*?)"/)[1];
      // }
      // 海阔视界规则分享，当前分享的是：小程序￥home_rule_v2￥base64://@测试声明@ey
      // 海阔视界规则分享，当前分享的是：小程序￥home_rule￥{"last_chapter_
      if (text.includes('￥home_rule')) {
        let rule;
        if (text.includes('￥home_rule_v2￥')) {
          rule = text.split('@')[2];
          rule = decodeURIComponent(escape(window.atob(rule)));
        } else if (text.includes('￥home_rule_url￥')) {
          const url = text.split('￥home_rule_url￥')[1];
          const { data } = await http(url);
          rule = data;
        } else {
          rule = text.replace(/^.*?￥home_rule￥/, '');
        }
        let json = JSON.parse(rule);
        json.pageList = json.pageList || JSON.parse(json.pages);
        ruleData.value = { ...default_rule, ...json };
        message.success('导入成功！');
        return;
      }
      message.error('口令无法识别，请确认规则是否正确');
    } catch (e) {
      message.error('抱歉，导入错误');
    }
  };

  const dropHandler = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer.items[0];
    if (data.kind === 'file') {
      const file = data.getAsFile();
      if (file.name.includes('.txt') || file.name.includes('.hiker')) {
        importText.value = await file.text();
      } else {
        message.error('不支持此文件');
      }
    }
  };
  const dragOverHandler = (e) => {
    e.preventDefault();
  };
  return {
    showImportModal,
    importText,
    onImportAfterLeaver,
    onImportPositiveClick,
    dragOverHandler,
    dropHandler,
  };
};

// 导出规则
export const useExport = (ruleData, message) => {
  const exportOptions = [
    {
      label: '明文口令',
      key: 'plaintextPWD',
    },
    {
      label: '编码口令',
      key: 'base64PWD',
    },
    // {
    //   label: '云剪切板1',
    //   key: 'cloudClipboard1',
    // },
    // {
    //   label: '云剪切板2',
    //   key: 'cloudClipboard2',
    // },
    // {
    //   label: '云剪切板5',
    //   key: 'cloudClipboard5',
    // },
    // {
    //   label: '云剪切板6',
    //   key: 'cloudClipboard6',
    // },
    // {
    //   label: '云剪切板7',
    //   key: 'cloudClipboard7',
    // },
    // {
    //   label: '云剪切板8',
    //   key: 'cloudClipboard8',
    // },
    // {
    //   label: '云剪切板9',
    //   key: 'cloudClipboard9',
    // },
    // {
    //   label: '云剪切板10',
    //   key: 'cloudClipboard10',
    // },
  ];
  const handleSelectExport = async (key) => {
    const title = ruleData.value.title;
    if (!title) {
      message.error('规则名不存在');
      return;
    }
    ruleData.value.pages = JSON.stringify(ruleData.value.pageList);
    let text = JSON.stringify(ruleData.value);
    try {
      if (key === 'plaintextPWD') {
        // 明文口令
        text = '海阔视界规则分享，当前分享的是：小程序￥home_rule￥' + text;
      } else {
        // base64口令
        text = window.btoa(unescape(encodeURIComponent(text)));
        text = `海阔视界规则分享，当前分享的是：小程序￥home_rule_v2￥base64://@${title}@${text}`;
        // if (key === 'cloudClipboard1') {
        //   // 云剪切板1
        //   // message.error('抱歉，暂不支持');
        //   const { data } = await http('https://pastebin.com/api/api_post.php', {
        //     method: 'post',
        //     body: `api_dev_key=Qs2VjmfmU1Qz-SGdXpUV6fRPquPzR0js&api_paste_code=${encodeURIComponent(
        //       text
        //     )}&api_paste_private=0&api_paste_expire_date=N&api_paste_name=小程序：${title}&api_user_key=c02545bd6fcfc9dcb82b36cd8ac7be61&api_paste_format=javascript&api_option=paste`,
        //   });
        //   text = `${data}\n\n小程序：${title}`;
        // } else if (key === 'cloudClipboard2') {
        //   // 云剪切板2
        //   const { data } = await http('https://netcut.cn/api/note/create/', {
        //     method: 'post',
        //     body: `note_name=cz${parseInt(Date.now() / 1000)}&note_content=${encodeURIComponent(
        //       text
        //     )}&note_pwd=0&expire_time=31536000`,
        //   });
        //   text = `https://netcut.cn/p/${JSON.parse(data).data.note_id}\n\n小程序：${title}`;
        // } else if (key === 'cloudClipboard5') {
        //   const { url } = await http('https://cmd.im/', {
        //     method: 'post',
        //     body: `txt=${encodeURIComponent(text)}`,
        //   });
        //   text = `${url}\n\n小程序：${title}`;
        // } else if (key === 'cloudClipboard6') {
        //   // https://pasteme.tyrantg.com/xxxxxx/lyt5gjhfifzbzq44@KamPyI 小程序：lPTV港澳台
        //   // console.log(decodeURIComponent(text));
        //   const { data } = await http('https://pasteme.tyrantg.com/api/create', {
        //     method: 'post',
        //     body: JSON.stringify({
        //       lang: 'plain',
        //       content: text,
        //       password: Math.random().toString(36).substring(2, 8),
        //     }),
        //     headers: {
        //       'content-type': 'application/json;charset=utf-8',
        //     },
        //   });
        //   const json = JSON.parse(data);
        //   text = `https://pasteme.tyrantg.com/xxxxxx/${json.data.path}@${json.data.password}\n\n小程序：${title}`;
        // } else if (key === 'cloudClipboard7') {
        //   // https://note.ms/ekox/x/y 小程序：lPTV港澳台1
        //   const { url } = await http('https://note.ms/');
        //   const { data } = await http(url, {
        //     method: 'post',
        //     body: `&t=${encodeURIComponent(text)}`,
        //     headers: {
        //       referer: url,
        //     },
        //   });
        //   if (!data) text = `${url}/x/y\n\n小程序：${title}`;
        //   else throw new Error('云剪切板7请求错误');
        // } else if (key === 'cloudClipboard8') {
        //   // https://paste.nugine.xyz/0w6y3iey
        //   // const { data } = await http('https://paste.nugine.xyz/api/records', {
        //   //   method: 'put',
        //   //   body: JSON.stringify({
        //   //     content: text,
        //   //     expiration_seconds: 259200,
        //   //     lang: 'plaintext',
        //   //     title: title,
        //   //   }),
        //   //   mode: 'same-origin',
        //   //   headers: {
        //   //     'content-type': 'application/json',
        //   //     referer: 'https://paste.nugine.xyz/',
        //   //     'sec-fetch-site': 'same-origin',
        //   //   },
        //   // });
        //   // text = `https://paste.nugine.xyz/api/records/${JSON.parse(data).key}\n\n小程序：${title}`
        //   throw new Error('云剪切板8请求错误');
        // } else if (key === 'cloudClipboard9') {
        //   // 剪切板9
        //   // https://txtpbbd.cn/a/b/160526xP
        //   const { data } = await http('https://a6.qikekeji.com/txt/data/save/', {
        //     method: 'post',
        //     body: `txt_content=[{"content":"${encodeURIComponent(
        //       text
        //     )}","title":"${title}"}]&passwork=&txt_name=${Math.random().toString(36).substring(2, 10)}&v_id`,
        //   });
        //   text = `https://txtpbbd.cn/a/b/${JSON.parse(data).data.txt_name}\n\n小程序：${title}`;
        // } else if (key === 'cloudClipboard10') {
        //   // https://hassdtebin.com/share/a/b/faqocowita  小程序：lPTV港澳台
        //   await http('https://www.toptal.com/developers/hastebin/api/termsAndConditions', {
        //     method: 'post',
        //   });
        //   const { data } = await http('https://www.toptal.com/developers/hastebin/api/documents', {
        //     method: 'post',
        //     body: encodeURIComponent(text),
        //     headers: {
        //       'content-type': 'text/plain;charset=utf-8',
        //     },
        //   });
        //   text = `https://hassdtebin.com/share/a/b/${JSON.parse(data).key}\n\n小程序：${title}`;
        // }
      }
      navigator.clipboard.writeText(text).catch(() => {
        const readOnlyTextArea = document.createElement('textarea');
        readOnlyTextArea.value = text;
        readOnlyTextArea.setAttribute('readonly', true);
        document.body.appendChild(readOnlyTextArea);
        readOnlyTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(readOnlyTextArea);
      });
      message.success('规则已复制到剪切板');
    } catch (e) {
      message.error('Error: ' + e.message);
    }
  };
  return { exportOptions, handleSelectExport };
};

// 模板
export const useTemplate = (ruleData, message) => {
  const templateTitle = ref('');
  const templates = ref(JSON.parse(localStorage.getItem('templates')) ?? []);
  const allTemplateTitles = computed(() =>
    templates.value.map(({ title }) => ({
      value: title,
    }))
  );
  const rmTemplateShow = ref(false);
  const addTemplateShow = ref(false);
  const addTemplatePositiveClick = () => {
    const index = templates.value.findIndex((v) => v.title === ruleData.value.title);
    templates.value[index] = structuredClone(toRaw(ruleData.value));
    localStorage.setItem('templates', JSON.stringify(templates.value));
    message.success('模板覆盖成功');
    addTemplateShow.value = false;
  };
  const addTemplate = () => {
    const title = ruleData.value.title;
    if (!title) {
      message.error('规则名不能为空');
      return;
    }
    const index = templates.value.findIndex((v) => v.title === title);
    if (~index) {
      addTemplateShow.value = true;
    } else {
      templates.value.push(structuredClone(toRaw(ruleData.value)));
      localStorage.setItem('templates', JSON.stringify(templates.value));
      message.success('模板添加成功');
    }
  };
  function rmTemplatePositiveClick() {
    templates.value = templates.value.filter((v) => v.title != templateTitle.value);
    // chrome.storage.local.set({ templates: toRaw(templates.value) }, () => {
    //   message.success('删除成功');
    //   templateTitle.value = '';
    // });
    localStorage.setItem('templates', JSON.stringify(templates.value));
    message.success('删除成功');
    templateTitle.value = '';
    rmTemplateShow.value = false;
  }
  const rmTemplate = () => {
    // console.log(rmTemplateShow.value);
    if (!templateTitle.value) {
      // console.log(JSON.parse(JSON.stringify(ruleData.value)));
      message.error('请先选择要删除的模板');
      return;
    }
    rmTemplateShow.value = true;
  };
  const selectTemplateTitle = (title) => {
    // console.log(title);
    ruleData.value = toRaw(templates.value.filter((v) => v.title === title)[0]);
  };
  return {
    templateTitle,
    allTemplateTitles,
    rmTemplateShow,
    addTemplateShow,
    addTemplatePositiveClick,
    rmTemplatePositiveClick,
    addTemplate,
    rmTemplate,
    selectTemplateTitle,
  };
};
