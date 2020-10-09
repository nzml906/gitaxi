import Vue from 'vue';
import VueRouter from 'vue-router';
const Home = () => import('@/pages/Home.vue');
const SearchResult = () => import('@/pages/SearchResult.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: SearchResult
  }
];

const router = new VueRouter({
  routes
});

export default router;
