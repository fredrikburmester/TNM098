<template>
    <!-- <v-chart class="chart" :option="option" :loading="loading" /> -->
    <div id="main"></div>
</template>

<script>
import 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, defineComponent } from 'vue'
import busLinesJson from '@/assets/lines-bus.json'
import geoJson from '@/assets/geoJson.json'
//import usaJson from '@/assets/usaJson.json'
import * as echarts from 'echarts'

export default defineComponent({
    name: 'HelloWorld',

    components: {
        // VChart,
    },
    provide: {
        [THEME_KEY]: 'light',
    },

    data() {
        return {
            loading: false,
        }
    },
    mounted() {
        var chartDom = document.getElementById('main')
        var myChart = echarts.init(chartDom)
        echarts.registerMap('USA', geoJson)

        let option = {
            title: {
                text: 'USA Population Estimates (2012)',
                subtext: 'Data from www.census.gov',
                sublink: 'http://www.census.gov/popest/data/datasets.html',
                left: 'right',
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
            },
            visualMap: {
                left: 'right',
                min: 500000,
                max: 38000000,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                },
                text: ['High', 'Low'],
                calculable: true,
            },
            toolbox: {
                show: true,
                //orient: 'vertical',
                left: 'left',
                top: 'top',
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {},
                },
            },
            series: [
                {
                    name: 'USA PopEstimates',
                    type: 'map',
                    roam: true,
                    map: 'USA',
                    emphasis: {
                        label: {
                            show: true,
                        },
                    },
                    data: [{ name: 'Northwest', value: 4822023 }],
                },
            ],
        }
        myChart.setOption(option)
    },
    methods: {
        generateRandomHexColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16)
        },
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
