import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
    },
    {
        path: '/listado',
        name: 'LisatdoArticulos',
        component: () => import(/* webpackChunkName: "ListadoArticulos" */ '../views/ListadoArticulos.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router;
