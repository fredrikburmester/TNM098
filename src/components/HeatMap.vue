<script>
import 'echarts'
import { defineComponent, watch } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useCategoriesStore } from '@/stores/categories'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
    name: 'HeatMap',

    components: {},
    setup() {
        const areasStore = useAreasStore()
        const categoriesStore = useCategoriesStore()
        let selectedCategory = ref(categoriesStore.selectedCategory)

        const keys = Object.keys(areasStore.reports).sort((a, b) => {
            return new Date(a) - new Date(b)
        })

        const categoryNames = Object.values(categoriesStore.categoryNames)

        // const getDataPerCategory = (category) => {
        //     let data = areasStore.perLineData.map((report) => {
        //         return [report.datetime, parseInt(report.location), parseFloat(report[categoriesStore.categories[category]])]
        //     })
        //     return data
        // }

        // let dataPerCategory = []
        // for (let category of Object.keys(categoriesStore.categories)) {
        //     dataPerCategory.push({
        //         id: category,
        //         data: getDataPerCategory(category),
        //     })
        // }

        // const filterCategoryDataPerArea = (category, area) => {
        //     return dataPerCategory[category].data.filter((report) => {
        //         return report[1] == area
        //     })
        // }

        const getDataPerLocation = (location) => {
            let data = []
            let dataPerLocation = areasStore.perLineData.filter((report) => report.location == location)
            for (let report of dataPerLocation) {
                data.push([report.datetime, 0, parseFloat(report['sewer_and_water']) || 0])
                data.push([report.datetime, 1, parseFloat(report['power']) || 0])
                data.push([report.datetime, 2, parseFloat(report['roads_and_bridges']) || 0])
                data.push([report.datetime, 3, parseFloat(report['medical']) || 0])
                data.push([report.datetime, 4, parseFloat(report['buildings']) || 0])
                data.push([report.datetime, 5, parseFloat(report['shake_intensity']) || 0])
            }

            return data
        }

        const getOptionsPerArea = (area) => {
            return {
                tooltip: {
                    position: 'top',
                },
                toolbox: {},
                dataset: {
                    source: getDataPerLocation(area),
                },
                dataZoom: [
                    {
                        type: 'inside',
                    },
                    {
                        type: 'slider',
                        top: '70%',
                    },
                ],
                grid: {
                    height: '50%',
                    top: '10%',
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    splitArea: {
                        show: false,
                    },
                    axisLabel: {
                        formatter: function (value) {
                            return value // `${new Date(value).getFullYear()}/${new Date(value).getMonth() + 1}/${new Date(value).getDate()}`
                        },
                    },
                },
                yAxis: {
                    type: 'category',
                    data: categoryNames,
                    splitArea: {
                        show: true,
                    },
                },
                visualMap: {
                    min: 0,
                    max: 10,
                    calculable: true,
                    orient: 'vertical',
                    right: '5%',
                    bottom: '40%',
                },
                series: [
                    {
                        name: 'Heat Map',
                        type: 'heatmap',
                        label: {
                            show: false,
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            }
        }

        var myChart1
        var myChart2

        // watch(
        //     () => categoriesStore.selectedCategory,
        //     (val) => {
        //         selectedCategory.value = val
        //         option.series[0].data = dataPerCategory[selectedCategory.value].data
        //         myChart1.setOption(option)
        //     }
        // )
        let numberOfDataPointsToShow = 20
        let i = 1
        let option1
        let localUpdateFrequency = categoriesStore.updateFreq

        watch(
            () => areasStore.selectedArea,
            (val) => {
                option1 = getOptionsPerArea(areasStore.selectedArea)

                if (i < numberOfDataPointsToShow) {
                    option1.xAxis.data = keys.slice(0, i)
                } else {
                    option1.xAxis.data = keys.slice(i - numberOfDataPointsToShow, i)
                }

                myChart1.setOption(option1)
            }
        )

        watch(
            () => categoriesStore.updateFreq,
            (val) => {
                console.log(val)
                localUpdateFrequency = val
            }
        )

        onMounted(() => {
            let chartDom1 = document.getElementById('main__heatmap_1')
            option1 = getOptionsPerArea(areasStore.selectedArea)
            myChart1 = echarts.init(chartDom1, 'dark')
            myChart1.setOption(option1)

            let j = 0
            setInterval(() => {
                if (!categoriesStore.isPaused && !(j % categoriesStore.updateFrequency)) {
                    categoriesStore.currentDataPoint = keys[i]
                    if (i < numberOfDataPointsToShow) {
                        option1.xAxis.data = keys.slice(0, i)
                    } else {
                        option1.xAxis.data = keys.slice(i - numberOfDataPointsToShow, i)
                    }
                    myChart1.setOption(option1)
                    i++
                }
                j++
            }, 1000)
        })

        const getAreaName = (area) => {
            for (let a of areasStore.areas) {
                if (a.id == area) return a.name
            }
        }

        return { selectedCategory, getAreaName, areasStore }
    },
})
</script>

<template>
    <div>
        <h1 class="text-3xl text-white">{{ getAreaName(areasStore.selectedArea) }}</h1>
        <div id="main__heatmap_1" class="main__heatmap"></div>
    </div>
</template>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
.main__heatmap {
    width: 100%;
    height: 500px;
}
#loading-spinner {
    position: absolute;
    top: 30%;
    left: 50%;
}
</style>
