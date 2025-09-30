import { createRouter } from 'vue-router';
import HikerLayout from '../views/HikerLayout/index.vue';
import HikerRule from '../views/HikerRule/index.vue';
import { createMemoryHistory } from 'vue-router';
const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HikerLayout,
      children: [
        {
          path: '',
          name: 'rule',
          component: HikerRule,
        },
        {
          path: '/js',
          name: 'js',
          component: () => import('../views/HikerJs/index.vue'),
        },
      ],
    },
  ],
});

export default router;
