<template>
    <div>
        <h1 class="text-xl text-white font-bold pb-4">Categories</h1>
        <div class="form-control">
            <!-- <select v-model="localSelectedCategory" class="select text-black bg-slate-300 select-bordered w-full max-w-xs">
                <option disabled selected>Select Value</option>
                <option v-for="(category, index) in categories" :key="index" :value="index">{{ getNiceCategoryName(index) }}</option>
            </select> -->
            <div v-for="category in Object.keys(categories)" :key="category">
                <label class="label cursor-pointer">
                    <span class="text-white">{{ getNiceCategoryName(category) }}</span>
                    <input
                        v-if="selectedCategories[category] === true"
                        type="checkbox"
                        class="toggle toggle-primary"
                        checked
                        @click="onToggle(category, false)"
                    />
                    <input v-else type="checkbox" class="toggle toggle-primary" @click="onToggle(category, true)" />
                </label>
            </div>
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
        return {
            localSelectedCategory: 0,
        }
    },
    computed: {
        ...mapWritableState(useCategoriesStore, ['categories', 'selectedCategory', 'categoryNames', 'selectedCategories']),
    },
    watch: {
        localSelectedCategory(newValue) {
            this.selectedCategory = newValue
        },
    },
    mounted() {},
    methods: {
        getNiceCategoryName(category) {
            return this.categoryNames[category]
        },
        onToggle(categoryKey, add) {
            this.selectedCategories[categoryKey] = add
        },
    },
}
</script>
