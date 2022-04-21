<script>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBarComponent.vue'

import { useUserStore } from '@/stores/user'
import { mapWritableState, mapActions } from 'pinia'

export default {
    name: 'App',
    components: {
        NavBar,
        RouterView,
    },
    setup() {},
    data() {
        return {
            route: this.$route,
        }
    },
    computed: {
        ...mapWritableState(useUserStore, ['authenticated']),
    },
}
</script>

<template>
    <NavBar />
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition name="fade" mode="out-in">
                <KeepAlive>
                    <component :is="Component"></component>
                </KeepAlive>
            </Transition>
        </template>
    </RouterView>
</template>

<style>
@import '@/assets/base.css';

#app {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
}

.fixed-center-button {
    left: 50% !important;
    transform: translate(-50%, 0) !important;
    width: calc(100vw - 5em) !important;
    max-width: 700px !important;
    position: fixed !important;
    bottom: 40px !important;
    animation: none !important;
    transition: none !important;
}
.fade-enter-active,
.fade-leave-active {
    transition: all 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
