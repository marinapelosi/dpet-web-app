import { createRouter, createWebHistory } from 'vue-router';
import PetList from '@/components/PetList.vue';

const routes = [
  { path: '/', component: PetList }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
