import { createRouter, createWebHistory } from 'vue-router';
import PetList from '@/components/PetList.vue';
import PetForm from './components/PetForm.vue';

const routes = [
  { path: '/', component: PetList },
  { path: '/form', component: PetForm }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
