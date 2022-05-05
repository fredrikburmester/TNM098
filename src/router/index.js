import { createRouter, createWebHistory } from 'vue-router'
import NotFoundComponent from '../components/NotFoundComponent.vue'
import HomeView from '../views/HomeView.vue'
import VisualizationOneView from '../views/VisualizationOneView.vue'
import VisTwo from '../views/VisTwo.vue'
import VisThree from '../views/VisThree.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView,
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/v1',
            name: 'VisOne',
            component: VisualizationOneView,
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/v2',
            name: 'VisTwo',
            component: VisTwo,
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/v3',
            name: 'VisThree',
            component: VisThree,
            meta: {
                requiresAuth: false,
            },
        },
        // will match everything and put it under `$route.params.pathMatch`
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundComponent },
    ],
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
})

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        // check if user is logged in
    }
})

export default router
