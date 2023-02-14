import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { EChartOption } from 'echarts';
import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';

@Component({
  selector: 'page-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class PageAnalyticsComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  hsOptions: EChartOption;
  caOptions: EChartOption;
  cgOptions: EChartOption;
  dOptions: EChartOption;
  piOptions: EChartOption;
  heOptions: EChartOption;
  table: any[];
  pieStyle: any;

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Analytics',
      breadcrumbs: [
        {
          title: 'Dashboard',
          route: 'dashboard'
        },
        {
          title: 'Analytics'
        }
      ]
    };
    this.table = [];
    this.pieStyle = {
      normal: {
        label: {
          color: '#000',
          position: 'inner'
        },
        labelLine: {
          show: false
        }
      }
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.getData('assets/data/team-activity.json', 'table', 'setLoaded');

    this.setHSOptions();
    this.setPAOptions();
    this.setCgOptions();
    this.setDOptions();
    this.setPIOptions();
    this.setHEOptions();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setHSOptions() {
    this.hsOptions = {
      color: ['#ed253d', '#2fa7ff'],
      tooltip: {
        trigger: 'none',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Clients 2018', 'Clients 2019']
      },
      grid: {
        left: 30,
        right: 30,
        top: 50,
        bottom: 50
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#2fa7ff'
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return (
                  'Clients ' +
                  params.value +
                  (params.seriesData.length
                    ? '：' + params.seriesData[0].data
                    : '')
                );
              }
            }
          },
          data: [
            '2019-1',
            '2019-2',
            '2019-3',
            '2019-4',
            '2019-5',
            '2019-6',
            '2019-7',
            '2019-8',
            '2019-9',
            '2019-10',
            '2019-11',
            '2019-12'
          ]
        },
        {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ed253d'
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return (
                  'Clients ' +
                  params.value +
                  (params.seriesData.length
                    ? '：' + params.seriesData[0].data
                    : '')
                );
              }
            }
          },
          data: [
            '2018-1',
            '2018-2',
            '2018-3',
            '2018-4',
            '2018-5',
            '2018-6',
            '2018-7',
            '2018-8',
            '2018-9',
            '2018-10',
            '2018-11',
            '2018-12'
          ]
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: ''
          }
        }
      ],
      series: [
        {
          name: 'Clients 2018',
          type: 'line',
          xAxisIndex: 1,
          smooth: true,
          areaStyle: {
            color: 'rgba(237,37,61,0.2)'
          },
          data: [159, 163, 174, 182, 174, 176, 175, 182, 119, 118, 112, 96]
        },
        {
          name: 'Clients 2019',
          type: 'line',
          smooth: true,
          areaStyle: {
            color: 'rgba(47,167,255,0.2)'
          },
          data: [83, 94, 100, 114, 124, 178, 194, 211, 234, 257, 263, 270]
        }
      ]
    };
  }

  setPAOptions() {
    this.caOptions = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br>{c} ({d}%)'
      },
      series: [
        {
          name: 'pie',
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 30,
          clockwise: true,
          radius: ['50%', '90%'],
          data: [
            {
              value: 347,
              name: '3-10',
              itemStyle: {
                normal: { color: '#fdd9f0', borderColor: '#f741b5' }
              }
            },
            {
              value: 310,
              name: '10-20',
              itemStyle: {
                normal: { color: '#d5edff', borderColor: '#2fa7ff' }
              }
            },
            {
              value: 234,
              name: '20-30',
              itemStyle: {
                normal: { color: '#fee8d7', borderColor: '#fc8b37' }
              }
            },
            {
              value: 195,
              name: '30-40',
              itemStyle: {
                normal: { color: '#ffd8dc', borderColor: '#ed253d' }
              }
            },
            {
              value: 670,
              name: '40+',
              itemStyle: {
                normal: { color: '#e6deff', borderColor: '#805aff' }
              }
            }
          ],
          itemStyle: this.pieStyle
        }
      ]
    };
  }

  setCgOptions() {
    this.cgOptions = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br>{c} ({d}%)'
      },
      series: [
        {
          name: 'pie',
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 30,
          clockwise: true,
          radius: [0, '90%'],
          data: [
            {
              value: 154,
              name: 'Female',
              itemStyle: {
                normal: {
                  color: '#fdd9f0',
                  borderColor: '#f741b5'
                }
              }
            },
            {
              value: 173,
              name: 'Male',
              itemStyle: {
                normal: {
                  color: '#d5edff',
                  borderColor: '#2fa7ff'
                }
              }
            }
          ],
          itemStyle: this.pieStyle
        }
      ]
    };
  }

  setDOptions() {
    this.dOptions = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br>{c} ({d}%)'
      },
      series: [
        {
          name: 'pie',
          type: 'pie',
          radius: [20, '90%'],
          roseType: 'radius',
          label: {
            normal: {
              show: true
            }
          },
          data: [
            {
              value: 115,
              name: 'Production',
              itemStyle: {
                normal: { color: '#fdd9f0', borderColor: '#f741b5' }
              }
            },
            {
              value: 173,
              name: 'Development',
              itemStyle: {
                normal: { color: '#fee8d7', borderColor: '#fc8b37' }
              }
            },
            {
              value: 154,
              name: 'Purchasing',
              itemStyle: {
                normal: { color: '#e6deff', borderColor: '#805aff' }
              }
            },
            {
              value: 180,
              name: 'Marketing',
              itemStyle: {
                normal: { color: '#d5edff', borderColor: '#2fa7ff' }
              }
            },
            {
              value: 219,
              name: 'Finance',
              itemStyle: {
                normal: { color: '#c1efc6', borderColor: '#7cdb86' }
              }
            }
          ],
          itemStyle: this.pieStyle
        }
      ]
    };
  }

  setPIOptions() {
    this.piOptions = {
      color: ['#805aff'],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      calculable: true,
      xAxis: {
        boundaryGap: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          name: 'Patients 2019',
          type: 'line',
          smooth: true,
          symbolSize: 6,
          data: [95, 124, 132, 143, 138, 178, 194, 211, 234, 257, 241, 226],
          areaStyle: {}
        }
      ]
    };
  }

  setHEOptions() {
    this.heOptions = {
      color: ['#cd5447'],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        boundaryGap: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          name: 'Patients 2019',
          type: 'line',
          smooth: true,
          symbolSize: 6,
          data: [94, 111, 90, 85, 70, 83, 94, 109, 89, 74, 83, 78],
          areaStyle: {}
        }
      ]
    };
  }

  sort({ key, value }) {
    const direction = value === 'ascend' ? 1 : -1;
    const sortFn = (prev, cur) => (prev[key] > cur[key] ? 1 : -1) * direction;
    this.table = this.table.sort(sortFn);
  }
}
