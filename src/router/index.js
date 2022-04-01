import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {title: "预约表",},
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {title: "学员登录",},
    },
    // {
    //     path: '/403',
    //     component: () => import('@/views/error-page/403'),
    //     name: 'Page403',
    //     meta: {title: '403'}
    // },
    // {
    //     path: '/404',
    //     component: () => import('@/views/error-page/404'),
    //     name: 'Page404',
    //     meta: {title: '404'}
    // },
    {path: '*', redirect: '/'}
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
