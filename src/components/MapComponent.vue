<template>
    <div id="main__map"></div>
</template>

<script>
import 'echarts'
import { THEME_KEY } from 'vue-echarts'
import { defineComponent } from 'vue'
import geoJson from '@/assets/geoJson.json'
import * as echarts from 'echarts'

export default defineComponent({
    name: 'HelloWorld',
    provide: {
        [THEME_KEY]: 'light',
    },
    data() {
        return {
            loading: false,
        }
    },
    mounted() {
        var chartDom = document.getElementById('main__map')
        var myChart = echarts.init(chartDom)
        echarts.registerMap('USA', geoJson)

        console.log(chartDom.clientHeight)

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
                    data: [{ name: 'Palace Hills', value: 14822023 }],
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
#main__map {
    height: 500px;
    width: 100%;
}
</style>
