<template>
  <div ref="dom" class="monacoEditor" :style="{ height: height + 'px' }"></div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import monaco from "../customMonaco.js";
const props = defineProps(["height", "language"]);
const modelValue = defineModel();

const height = ref(props.height ?? 67);

let editor = null;

watch(modelValue, () => {
  if (!editor?.hasTextFocus()) {
    editor?.setValue(modelValue.value);
  }
});
const autoSize = ({ contentHeight }) => {
  if (contentHeight > 457) {
    height.value = 457;
  } else if (contentHeight < 58) {
    height.value = 58;
  } else {
    height.value = contentHeight + 1;
  }
  editor.layout();
};
const dom = ref(null);
onMounted(() => {
  editor = monaco.editor.create(dom.value, {
    value: modelValue.value,
    language: props.language ?? "typescript",
    // cursorSmoothCaretAnimation: 'on',
    // theme: "vs",
    guides: {
      bracketPairs: "active",
    },
    automaticLayout: true,
    tabSize: 2,
    scrollBeyondLastLine: false, // 是否滚动到最后一行
    wordWrap: "on",
    scrollbar: {
      alwaysConsumeMouseWheel: false, // 始终使用鼠标滚轮事件，默认为 true
      verticalSliderSize: 8, // 垂直滑块的高度（以像素为单位）。默认为垂直滚动条大小
    },
  });

  // ts 编译 js
  // const compileTS = async (uri) => {
  //   const tsWorker = await monaco.languages.typescript.getTypeScriptWorker();
  //   const client = await tsWorker(uri);
  //   const result = await client.getEmitOutput(uri.toString());
  //   return result.outputFiles[0].text;
  // };

  editor.onDidChangeModelContent((e) => {
    modelValue.value = editor.getValue();
  });
  if (!props.height) {
    editor.onDidContentSizeChange((e) => {
      autoSize(e);
      requestAnimationFrame(autoSize);
    });
  }
});
</script>

<style scoped>
.monacoEditor {
  width: 100%;
  border: 1px solid #e0e0e6;
  border-radius: 2px;
  margin: 0 2px;
  transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.monacoEditor:hover {
  border-color: #36ad6a;
  transition:
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.monacoEditor:focus-within {
  border: 1px solid #36ad6a;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}
</style>
