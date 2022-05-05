<template>
    <div>
        <h1>Categories</h1>
        <div class="form-control">
            <label v-for="c in categories" :key="c" class="label cursor-pointer">
                <span class="label-text">{{ c }}</span>
                <input type="checkbox" class="toggle" checked />
            </label>
        </div>
    </div>
</template>

<script>
import { useCategoriesStore } from '@/stores/categories'
import { mapWritableState } from 'pinia'

export default {
    components: {},
    props: {},
    data() {
        return {}
    },
    computed: {
        ...mapWritableState(useCategoriesStore, ['categories']),
    },
    mounted() {},
    methods: {},
}
</script>
