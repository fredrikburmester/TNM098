<script>
// import 'echarts'
import { defineComponent } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import * as echarts from 'echarts'
import { useAreasStore } from '@/stores/areas'
import { mapWritableState } from 'pinia'

export default defineComponent({
    name: 'HeatMap',
    data() {
        return {
            loading: true,
            option: [],
            opacity: 0.2,
            keys: [],
            myChart: null,
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas', 'reports', 'perLineData', 'selectedArea', 'areaNames']),
        ...mapWritableState(useCategoriesStore, ['categories', 'selectedCategory', 'categoryNames']),
    },
    mounted() {
        let chartDom = document.getElementById('main__linechart')
        this.myChart = echarts.init(chartDom)

        //console.log(this.getDataPerLocation(1))

        this.keys = Object.keys(this.reports).sort((a, b) => {
            return new Date(a) - new Date(b)
        })

        //console.log(this.keys)

        this.option = {
            title: {
                text: 'Temperature Change in the Coming Week',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {},
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    restore: {},
                    saveAsImage: {},
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 10,
            },
            series: [
                {
                    name: 'Highest',
                    type: 'line',
                    data: [],
                    // markPoint: {
                    //     data: [
                    //         { type: 'max', name: 'Max' },
                    //         { type: 'min', name: 'Min' },
                    //     ],
                    // },
                    // markLine: {
                    //     data: [{ type: 'average', name: 'Avg' }],
                    // },
                },
            ],
        }

        this.myChart.setOption(this.option)

        this.run()
    },
    methods: {
        getDataPerLocation(location) {
            let result = []

            for (let i = 0; i < this.perLineData.length; i++) {
                if (this.perLineData[i].location == location) {
                    //console.log(this.perLineData[i])
                    if (i > 0 && this.perLineData[i].datetime == this.perLineData[i - 1].datetime) {
                        try {
                            result[i - 1].sewer_and_water = (this.perLineData[i].sewer_and_water + this.perLineData[i - 1].sewer_and_water) / 2
                            result[i - 1].power = (this.perLineData[i].power + this.perLineData[i - 1].power) / 2
                            result[i - 1].roads_and_bridges = (this.perLineData[i].roads_and_bridges + this.perLineData[i - 1].roads_and_bridges) / 2
                            result[i - 1].medical = (this.perLineData[i].medical + this.perLineData[i - 1].medical) / 2
                            result[i - 1].buildings = (this.perLineData[i].buildings + this.perLineData[i - 1].buildings) / 2
                            result[i - 1].shake_intensity = (this.perLineData[i].shake_intensity + this.perLineData[i - 1].shake_intensity) / 2
                        } catch (e) {
                            console.log(e)
                        }
                    } else {
                        result.push(this.perLineData[i])
                    }
                }
            }
            return result
        },
        run() {
            let i = 0
            let data = this.getDataPerLocation(this.selectedArea)

            //console.log(data)
            //console.log('Data for this location: ', data)
            let currentKeys = []

            let j = 0
            let currentData = []

            let k = 0

            setInterval(() => {
                currentKeys.push(this.keys[i])
                if (data[j].datetime == this.keys[i]) {
                    currentData.push(data[j])
                    j++
                } else {
                    currentData.push(null)
                }

                this.option.series[0].data = currentData
                    .map((report) => {
                        if (report == null) {
                            return null
                        } else {
                            return parseFloat(report.sewer_and_water)
                        }
                    })
                    .slice(i - 10, i)

                this.option.xAxis.data = currentKeys.slice(i - 10, i)

                this.myChart.setOption(this.option)

                //console.log(data[j], j, this.keys[i], i)

                i = i + 1
            }, (i + 1) * 100)
        },
    },
})
</script>

<template>
    <div>
        <div id="main__linechart"></div>
    </div>
</template>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
#main__linechart {
    height: 500px;
    width: 100%;
}
#loading-spinner {
    position: absolute;
    top: 30%;
    left: 50%;
}
</style>
