import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { EChartOption } from 'echarts';

import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';

@Component({
  selector: 'page-e-commerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class PageECommerceComponent extends BasePageComponent implements OnInit, OnDestroy {
  salesOptions: EChartOption;
  revenueOptions: EChartOption;
  ordersData: any[];

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.pageData = {
      title: 'eCommerce',
      breadcrumbs: [
        {
          title: 'Home',
          route: 'dashboard',
        },
        {
          title: 'eCommerce',
        },
      ],
    };
    this.ordersData = [];
  }

  ngOnInit() {
    super.ngOnInit();

    this.setSalesOptions();
    this.setRevenueOptions();
    this.getData('assets/data/recent-orders.json', 'ordersData', 'setLoaded');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setSalesOptions() {
    this.salesOptions = {
      color: ['#3640f9', '#99dced'],
      grid: {
        left: 22,
        right: 20,
        top: 20,
        bottom: 20
      },
      legend: {
        data: ['Online', 'Offline']
      },
      tooltip: {
        trigger: 'axis'
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          axisLine: {
            lineStyle: {
              color: '#c5c4c2'
            }
          }
        }
      ],
      yAxis: [
        {
          type : 'value',
          axisLine: {
            lineStyle: {
              color: '#3640f9'
            }
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Online',
          type: 'bar',
          data: [20, 34, 17, 35, 57, 60, 62, 47],
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 5
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Highest' },
              { type: 'min', name: 'Lowest' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average' }
            ]
          }
        },
        {
          name: 'Offline',
          type: 'bar',
          data: [12, 31, 15, 29, 38, 45, 32, 48],
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 5
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Highest' },
              { type: 'min', name: 'Lowest' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average' }
            ]
          }
        }
      ]
    };
  }

  setRevenueOptions() {
    this.revenueOptions = {
      color: ['#2fa7ff'],
      grid: {
        left: 50,
        right: 0,
        top: 10,
        bottom: 20
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#2fa7ff'
            }
          },
          data: ['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th']
        }
      ],
      yAxis : [
        {
          type : 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#c5c4c2'
            }
          },
          axisLabel : {
            formatter: '${value} K'
          }
        }
      ],
      series : [
        {
          name: 'Revenue',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbolSize: 12,
          data: [0.9, 1.2, 2.1, 2.3, 2, 1.9, 2.1, 2.4, 1.7, 1.2, 0.8, 1, 1.4]
        }
      ]
    };
  }
}
