<template>
    <div class="navbar bg-base-200 text-neutral px-4 h-16">
        <router-link v-for="l in links" :key="l.path" :to="l.path" class="btn btn-sm btn-ghost normal-case text-xl hover:bg-primary">
            {{ l.name }}
        </router-link>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const links = ref([
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'V1',
        path: '/v1',
    },
    {
        name: 'Contact',
        path: '/contact',
    },
])
</script>
