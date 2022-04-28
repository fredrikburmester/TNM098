import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import VueFeather from 'vue-feather'

import ECharts from 'vue-echarts'

const app = createApp(App)

const pinia = createPinia()

pinia.use(({ store }) => {
    store.$router = markRaw(router)
})

app.use(pinia)
app.use(router)
app.component(VueFeather.name, VueFeather)
app.component('VChart', ECharts)
app.mount('#app')
