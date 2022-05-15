<template>
    <h1 class="text-white font-bold text-xl">Priority List</h1>
    <div id="main__priority_list"></div>
</template>

<script>
import 'echarts'
import { THEME_KEY } from 'vue-echarts'
import { defineComponent } from 'vue'
import * as echarts from 'echarts'
import { mapWritableState } from 'pinia'
import { useAreasStore } from '@/stores/areas'

export default defineComponent({
    name: 'HelloWorld',
    provide: {
        [THEME_KEY]: 'dark',
    },
    data() {
        return {
            loading: false,
            flags: [],
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas']),
    },
    async mounted() {
        await fetch('https://cdn.jsdelivr.net/npm/emoji-flags@1.3.0/data.json')
            .then((res) => res.json())
            .then((res) => {
                this.flags = res
            })
        var chartDom = document.getElementById('main__priority_list')
        var myChart = echarts.init(chartDom, 'dark')

        let areas = []

        console.log(this.areas);

        for (let area of this.areas) {
            let obj = []
            obj.push(area.priority)
            obj.push(area.name)
            areas.push(obj)
        }

        const dimension = 0

        let option = {
            grid: {
                top: 10,
                bottom: 30,
                left: 150,
                right: 80,
            },
            xAxis: {
                max: 'dataMax',
                axisLabel: {
                    formatter: function (n) {
                        return n
                    },
                },
            },
            dataset: {
                source: areas,
            },
            yAxis: {
                type: 'category',
                inverse: true,
                max: 18,
                axisLabel: {
                    show: true,
                    fontSize: 14,
                    formatter: (value) => {
                        return value
                    },
                    rich: {
                        flag: {
                            fontSize: 25,
                            padding: 1,
                        },
                    },
                },
                // animationDuration: 300,
                // animationDurationUpdate: 300,
            },
            series: [
                {
                    realtimeSort: true,
                    seriesLayoutBy: 'column',
                    type: 'bar',
                    itemStyle: {
                        color: function (param) {
                            return param.value[2]
                        },
                    },
                    encode: {
                        x: dimension,
                        y: 3,
                    },
                    label: {
                        show: true,
                        precision: 1,
                        position: 'right',
                        valueAnimation: true,
                        fontFamily: 'monospace',
                    },
                },
            ],
            // Disable init animation.
            // animationDuration: 0,
            // animationDurationUpdate: updateFrequency,
            // animationEasing: 'linear',
            // animationEasingUpdate: 'linear',
            // graphic: {
            //     elements: [
            //         {
            //             type: 'text',
            //             right: 160,
            //             bottom: 60,
            //             style: {
            //                 text: 'hej',
            //                 font: 'bolder 80px monospace',
            //                 fill: 'rgba(100, 100, 100, 0.25)',
            //             },
            //             z: 100,
            //         },
            //     ],
            // },
        }
        myChart.setOption(option)
    },
    methods: {
        generateRandomHexColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16)
        },
        getFlag(countryName) {
            if (!countryName) {
                return ''
            }
            return (
                this.flags.find(function (item) {
                    return item.name === countryName
                }) || {}
            ).emoji
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
#main__priority_list {
    height: 500px;
    width: 100%;
}
</style>
