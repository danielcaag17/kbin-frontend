import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../components/HomePage.vue'
import ShowDetallThread from "@/components/ShowDetallThread.vue";
import CercadorThreads from "@/components/CercadorThreads.vue";
import UserProfile from "../components/UserProfile.vue";

import '/public/assets/css/app.910c0aab.css';
import '/public/assets/css/824.b4cc3385.css';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/:activeOption/:activeFilter',
        name: 'HomePage1',
        component: HomePage
    },
    {
        path: '/thread/:id/top/',
        name: 'ShowDetallThread',
        component: ShowDetallThread,
        props: true
    },
    {
        path: '/cercador/:activeOption/:activeFilter',
        name: 'CercadorThreads',
        component: CercadorThreads
    },
    {
        path: '/cercador/',
        name: 'CercadorThreads1',
        component: CercadorThreads
    },
]
const user_routes = [
    {
        path: '/u/:username/',
        name: 'UserProfile',
        component: UserProfile,
        props: true
    },
]

// Combinar les rutes
const combinedRoutes = [...routes, ...user_routes];

const router = createRouter({
    history: createWebHistory(),
    routes: combinedRoutes,
})

export default router