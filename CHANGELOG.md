### v1.0.4 (_2025-09-30_)

- feat: monaco-editor 打包优化，原来 18MB 减少到现在 11MB，减少了约 38.89%
- chore(deps): 删除 vite-plugin-monaco-editor-esm 依赖
- chore(deps): 删除 esbuild 依赖

### v1.0.3 (_2025-09-30_)

- feat: 编辑 prettier.config.js 可修改 Prettier 配置文件
- feat: 编辑 suggestions.js 可修改建议
- feat: monaco edit 会自动读取 type/\*.d.ts 文件，用于代码提示
- chore(deps): 更新 axios 到 v1.12.2
- chore(deps): 更新 monaco-edit 到 v0.53.0
- chore(deps): 更新 prettier 到 v3.6.2
- chore(deps): 更新 vue 到 v3.5.22
- chore(deps): 更新 vue-router 到 v4.5.1
- chore(deps): 更新 @vitejs/plugin-vue 到 v6.0.1
- chore(deps): 更新 naive-ui 到 v2.43.1
- chore(deps): 更新 vite 到 vnpm:rolldown-vite@7.1.12 编译速度提升明显
- chore(deps): 更新 vite-plugin-monaco-editor-esm 到 v2.0.2
- chore(deps): 更新 esbuild 到 v0.25.10

### v1.0.2

- feat: 添加选择端口

### v1.0.1

- feat: 使用 Prettier 替换默认格式化
- feat: 完善 hiker.d.ts 声明文件
- fix: 修复 Ctrl + S 保存快捷键问题
