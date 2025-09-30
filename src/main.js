// import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import MonacoEditor from '@/components/MonacoEditor.vue';

import {
  create,
  NDialogProvider
} from 'naive-ui'

const naive = create({
  components: [NDialogProvider]
})

const app = createApp(App);
app.component('MonacoEditor', MonacoEditor);
app.use(router);
app.use(naive)
app.mount('#app');
