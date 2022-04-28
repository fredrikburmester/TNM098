<template>
    <v-chart class="chart" :option="option" :loading="loading" />
</template>

<script>
// import 'echarts'
// import { use } from 'echarts/core'
// import { CanvasRenderer } from 'echarts/renderers'
// import { PieChart } from 'echarts/charts'
// import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, defineComponent } from 'vue'

// use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

export default defineComponent({
    name: 'HelloWorld',

    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: 'light',
    },
    setup() {
        const option = ref({
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)',
                    },
                },
            ],
        })

        return { option }
    },
    data() {
        return {
            loading: false,
        }
    },
})
</script>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
</style>
