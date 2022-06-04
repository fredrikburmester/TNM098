import { createRouter, createWebHistory } from 'vue-router'
import NotFoundComponent from '../components/NotFoundComponent.vue'
import HomeView from '../views/HomeView.vue'

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
