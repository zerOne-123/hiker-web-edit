import * as monaco from "monaco-editor";
// 配置 Monaco Editor 的 Web Worker
self.MonacoEnvironment = (function (paths) {
  return {
    globalAPI: false,
    getWorkerUrl: (moduleId, label) => paths[label],
  };
})({
  editorWorkerService: "/monacoeditorwork/editor.worker.bundle.js",
  typescript: "/monacoeditorwork/ts.worker.bundle.js",
  javascript: "/monacoeditorwork/ts.worker.bundle.js",
});
// 加载 Prettier 用于格式化
import prettier from "prettier/standalone.mjs";
import prettierPluginBabel from "prettier/plugins/babel.mjs";
import prettierPluginEstree from "prettier/plugins/estree.mjs";
// 加载 prettier 配置
const prettierPath = "/prettier.config.js";
const prettierOptions = (await import(prettierPath)).default;
// 注册代码格式化功能
monaco.languages.registerDocumentFormattingEditProvider("typescript", {
  provideDocumentFormattingEdits: async (model) => {
    const range = model.getFullModelRange();
    // 由于 js: 会导致格式化错误，所以判断下，如果有就忽略第一行
    if (model.getValue().trimStart().startsWith("js:")) {
      range.startLineNumber = 2;
    }
    let text = model.getValueInRange(range);
    try {
      text = await prettier.format(text, {
        parser: "babel",
        plugins: [prettierPluginBabel, prettierPluginEstree],
        ...prettierOptions,
      });
    } catch (error) {
      console.log(error);
    }
    return [
      {
        range: range,
        text,
      },
    ];
  },
});
const options = {
  // target: monaco.languages.typescript.ScriptTarget.ESNext,
  allowNonTsExtensions: true,
  // isolatedModules: true, // 开启隔离模式，但需要添加export或import或export { }
  // moduleResolution: 2,
  allowJs: true,
  // checkJs: true,
  lib: ["esnext"], // 关键，去点 dom ，用不到 dom 的 api
};
// const hikerLibSource = await (await fetch("/config/hiker.d.ts")).text();
// import hikerLibSource from '/config/hiker.d.ts?raw';
// import hikerLibSource from '../public/config/hiker.ts?raw';
// const CryptoJSLibSource = await (await fetch("/config/CryptoJS.d.ts")).text();
// 添加声明有两种方式
// 1. 直接添加到默认
// monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
// 2. 创建模型时添加，只能创建一次，但能修改
// monaco.editor.createModel(libSource, 'javascript', monaco.Uri.parse(libUri));
// const files = import.meta.glob("/public/type/*.d.ts", {
//   query: "?raw",
//   import: "default",
// });
// console.log(files);

// for (const path in files) {
//   const name = path.split("/").pop();
//   const lib = await files[path]();
//   // console.log(name, lib);
//   monaco.languages.typescript.typescriptDefaults.addExtraLib(lib, `ts:${name}`);
// }
chrome.runtime.getPackageDirectoryEntry((rootEntry) => {
  // console.log(rootEntry);
  rootEntry.getDirectory("type", {}, (typeDirEntry) => {
    const reader = typeDirEntry.createReader();
    const files = [];
    // console.log(typeDirEntry);
    function readEntries() {
      reader.readEntries(async (entries) => {
        if (entries.length > 0) {
          files.push(
            ...entries.filter(
              (entry) => entry.isFile && entry.name.endsWith(".d.ts")
            )
          );
          readEntries(); // 继续读取直到没有更多条目
        } else {
          for (const entry of files) {
            const name = entry.name;
            const lib = await (await fetch(`/type/${entry.name}`)).text();
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              lib,
              `ts:${name}`
            );
          }
          // const urls = files.map((entry) => `/type/${entry.name}`)

          // Promise.all(urls.map((url) => fetch(url).then((res) => res.text())))
          //   .then((results) => {
          //     console.log("All data:", results);
          //   })
          //   .catch((err) => {
          //     console.error("Error in one of the requests:", err);
          //   });
        }
      });
    }
    readEntries();
  });
});
// monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   hikerLibSource,
//   "ts:hiker.d.ts"
// );
// monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   CryptoJSLibSource,
//   "ts:CryptoJS.d.ts"
// );
// 设置编译选项
monaco.languages.typescript.typescriptDefaults.setCompilerOptions(options);

// 动态导入建议
const suggestionsPath = "/suggestions.js";
const { SNIPPET, RESOURCE_INDENTIFIER, LINK_ROUTE } = await import(
  suggestionsPath
);
// 设置资源标识提示
monaco.languages.registerCompletionItemProvider("typescript", {
  provideCompletionItems: function (model, position) {
    const { lineNumber, column } = position;
    // 获取当前光标行前面的内容
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      endLineNumber: lineNumber,
      startColumn: 0,
      endColumn: column,
    });
    const match = /['"`]/.test(textBeforePointer);
    if (!match) {
      return { suggestions: [] };
    }
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: textBeforePointer.lastIndexOf("#") + 1,
      endColumn: word.endColumn,
    };
    return {
      suggestions: RESOURCE_INDENTIFIER.map((data) => {
        data.kind = monaco.languages.CompletionItemKind["Text"];
        data.range = range;
        data.insertText = data.label;
        data.insertTextRules =
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        return data;
      }),
    };
  },
  triggerCharacters: ["#"],
});
// 设置路由跳转链接的提示
monaco.languages.registerCompletionItemProvider("typescript", {
  provideCompletionItems: function (model, position) {
    const { lineNumber, column } = position;
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      endLineNumber: lineNumber,
      startColumn: 0,
      endColumn: column,
    });
    const match = /['"`]/.test(textBeforePointer);
    // console.log(textBeforePointer);
    if (!match) {
      return { suggestions: [] };
    }
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };
    return {
      suggestions: LINK_ROUTE.map((data) => {
        data.kind = monaco.languages.CompletionItemKind["Text"];
        data.range = range;
        data.insertText = data.label;
        data.insertTextRules =
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        return data;
      }),
    };
  },
});
// 设置代码片段的提示
monaco.languages.registerCompletionItemProvider("typescript", {
  provideCompletionItems: function (model, position) {
    const { lineNumber, column } = position;
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      endLineNumber: lineNumber,
      startColumn: 0,
      endColumn: column,
    });
    // console.log('光标前', textBeforePointer);
    // const textBeforePointerMulti = model.getValueInRange({
    //   startLineNumber: 1,
    //   endLineNumber: lineNumber,
    //   startColumn: 0,
    //   endColumn: column,
    // });
    // console.log('光标前多', textBeforePointerMulti);
    // const textAfterPointer = model.getValueInRange({
    //   startLineNumber: lineNumber,
    //   endLineNumber: lineNumber,
    //   startColumn: column,
    //   endColumn: model.getLineMaxColumn(model.getLineCount()),
    // });
    // console.log('光标后', textAfterPointer);
    // const textAfterPointerMulti = model.getValueInRange({
    //   startLineNumber: lineNumber,
    //   endLineNumber: model.getLineCount(),
    //   startColumn: column,
    //   endColumn: model.getLineMaxColumn(model.getLineCount()),
    // });
    // console.log('光标后多', textAfterPointerMulti);
    const match = /['"`]/.test(textBeforePointer);
    if (match) {
      return { suggestions: [] };
    }
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    return {
      suggestions: SNIPPET.map((data) => {
        data.kind = monaco.languages.CompletionItemKind["Snippet"];
        data.range = range;
        data.insertTextRules =
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        return data;
      }),
    };
  },
});

export default monaco;
