<template>
    <div id="main__map"></div>
</template>

<script>
import 'echarts'
import { THEME_KEY } from 'vue-echarts'
import { defineComponent } from 'vue'
import geoJson from '@/assets/geoJson.json'
import * as echarts from 'echarts'
import { useAreasStore } from '@/stores/areas'
import { mapWritableState } from 'pinia'

export default defineComponent({
    name: 'HelloWorld',
    provide: {
        [THEME_KEY]: 'light',
    },
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
    },
    mounted() {
        let chartDom = document.getElementById('main__map')
        this.myChart = echarts.init(chartDom, 'dark')
        echarts.registerMap('USA', geoJson)

        console.log(this.areas)
        console.log(this.reports)

        this.option = {
            title: {
                text: 'Areas',
                left: '0',
            },
            visualMap: {
                left: 'right',
                dimension: 1,
                min: 0,
                max: 10,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                },
                text: ['High', 'Low'],
                calculable: true,
                outOfRange: {
                    color: 'blue',
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
                        }
                    }
                    ,data: [],
                },
            ],
        }
        
        this.myChart.setOption(this.option)
        this.updateChart();
        
        this.myChart.on('click', (params) => {
            let id = this.getAreaId(params.name)
            if (id) {
                if (id === this.selectedArea) {
                    this.selectedArea = 1
                } else {
                    this.selectedArea = id
                }
            }
            console.log(this.selectedArea)
        })
        console.log(this.option)
    },
    methods: {
        // Add values from this.reports to this.option.series[0].data
        updateChart() {
            //replace current data with new data from next report
            let date= "2020-04-06 00:00:00"
            
            let currentData = []
            
            this.reports[date].map( report => {
                
                let id = parseFloat(report.loc)-1
                let location = this.getAreaName(id)
                let value = report.sewer_and_water

                if(currentData.findIndex(item => item.name === location) === -1) {
                    currentData.push({
                        name: location,
                        value: value
                    })
                } else {
                    currentData.find(item => item.name === location).value += value
                }
            })

            console.log(this.perLineData)
            console.log(currentData)
            this.option.series[0].data = currentData
            this.myChart.setOption(this.option)
        },

        getAreaId(name) {
            for (let area of this.areas) {
                if (area.name == name) {
                    return area.id
                }
            }
        },

        getAreaName(id) {
            for (let area of this.areas) {
                if (area.id == id) {
                    return area.name
                }
            }
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
    background-color: gray;
}
</style>
