import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import echarts, { EChartOption } from 'echarts';
import {UserService} from '../../../user/_services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class PageDashboardComponent extends BasePageComponent implements OnInit, OnDestroy {
  piOptions: EChartOption;
  pi2Options: EChartOption;
  lineOptions: EChartOption;
  barOptions: EChartOption;
  dOptions: EChartOption;
  dOptions2: EChartOption;
  browsersOptions: EChartOption;
  pieOptions: EChartOption;
  caOptions: EChartOption;
  cgOptions: EChartOption;
  tableData: any[];
  studentData: any[];
  peopleOptions: any[];
  companyOptions: any[];
  pieStyle: any;

  isAdmin = false;

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              private userService: UserService,
              private router: Router,
  ) {
    super(store, httpSv);

    this.peopleOptions = [
      {
        value: 'Bill Gates',
        label: 'Bill Gates',
      },
      {
        value: 'Tim Cook',
        label: 'Tim Cook',
      },
      {
        value: 'Jeff Bezos',
        label: 'Jeff Bezos',
      },
    ];

    this.companyOptions = [
      {
        value: 'Apple',
        label: 'Apple',
      },
      {
        value: 'Microsoft',
        label: 'Microsoft',
      },
      {
        value: 'Google',
        label: 'Google',
      },
    ];

    this.pageData = {
      title: 'Dashboard',
      breadcrumbs: [
        {
          title: 'Home',
          route: 'dashboard',
        },
        {
          title: 'Default',
        },
      ],
    };

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

  async ngOnInit() {
    super.ngOnInit();
    //TODO истеу керек
    if (!await this.userService.isAdmin()) {
      this.router.navigate(['/vertical/user-profile']);
    }

    this.getData('assets/data/students-rate.json', 'studentData', 'setLoaded');
    console.log(this.studentData);

    this.setBrowsersChart();
    this.setDOptions();
    this.setBarOptions();
    this.setPiOptions();
    this.setLineOptions();
    this.setPieOptions();
    this.setPi2Options();
    this.setPAOptions();
    this.setCgOptions();
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
              value: 41,
              name: 'Female',
              itemStyle: {
                normal: {
                  color: '#fdd9f0',
                  borderColor: '#f741b5'
                }
              }
            },
            {
              value: 59,
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
          radius: [10, '100%'],
          roseType: 'radius',
          label: {
            normal: {
              show: true
            }
          },
          data: [
            {
              value: 10,
              name: 'Бастауыш сынып',
              itemStyle: {
                normal: { color: '#f741b5', borderColor: '#f741b5' }
              }
            },
            {
              value: 5,
              name: 'Орыс тілі',
              itemStyle: {
                normal: { color: '#CE9A9B', borderColor: '#CE9A9B' }
              }
            },
            {
              value: 8,
              name: 'Педагогика-психология',
              itemStyle: {
                normal: { color: '#14CC60', borderColor: '#036D19' }
              }
            },
            {
              value: 27,
              name: 'Тарих-География',
              itemStyle: {
                normal: { color: '#fc8b37', borderColor: '#fc8b37' }
              }
            },
            {
              value: 34,
              name: 'Екі шет тілі',
              itemStyle: {
                normal: { color: '#2fa7ff', borderColor: '#2fa7ff' }
              }
            },
            {
              value: 18,
              name: 'Қазақ тілі - Әдебиет',
              itemStyle: {
                normal: { color: '#fc8b37', borderColor: '#D0A98F' }
              }
            }
          ],
        }
      ]
    };

    this.dOptions2 = {
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
          radius: [10, '100%'],
          roseType: 'radius',
          label: {
            normal: {
              show: true
            }
          },
          data: [
            {
              value: 45,
              name: 'Химия-Биология',
              itemStyle: {
                normal: { color: '#805aff', borderColor: '#805aff' }
              }
            },
            {
              value: 68,
              name: 'Математика-Физика',
              itemStyle: {
                normal: { color: '#F19811', borderColor: '#F08801' }
              }
            },
            {
              value: 25,
              name: 'Информатика',
              itemStyle: {
                normal: { color: '#3A2F8A', borderColor: '#392F5A' }
              }
            }
          ]
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
              value: 30,
              name: 'Aktau: 30%',
              itemStyle: {
                normal: { color: '#fdd9f0', borderColor: '#f741b5' }
              }
            },
            {
              value: 39,
              name: 'Aktobe: 39%',
              itemStyle: {
                normal: { color: '#d5edff', borderColor: '#2fa7ff' }
              }
            },
            {
              value: 17,
              name: 'Atyrau: 17%',
              itemStyle: {
                normal: { color: '#fee8d7', borderColor: '#fc8b37' }
              }
            },
            {
              value: 14,
              name: 'Oral: 14%',
              itemStyle: {
                normal: { color: '#ffd8dc', borderColor: '#ed253d' }
              }
            },
          ],
          itemStyle: {
            normal: {
              label: {
                color: '#000',
                position: 'inner'
              },
              labelLine: {
                show: false
              }
            }
          }
        }
      ]
    };
  }

  setBrowsersChart() {
    this.browsersOptions = {
      tooltip : {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['Бастауыш сынып', 'Тарих-География', 'Химия-Биология', 'Firefox']
      },
      calculable: true,
      series: (() => {
        const series = [];

        for (let i = 0; i < 30; i++) {
          const options = {
            name: 'Usage browser',
            type: 'pie',
            itemStyle: {
              normal: {
                label: {
                  show: i > 28
                },
                labelLine: {
                  show : i > 28,
                  length: 20
                }
              }
            },
            radius: [i * 4 + 40, i * 4 + 42],
            data: [
              {
                value: i * 10 + 90,
                name: 'Бастауыш сынып',
                itemStyle: { normal: { color: '#f741b5' } }
              },
              {
                value: i * 27  + 310,
                name: 'Тарих-География',
                itemStyle: { normal: { color: '#2fa7ff' } }
              },
              {
                value: i * 30  + 640,
                name: 'Химия-Биология',
                itemStyle: { normal: { color: '#305dff' } }
              },
              {
                value: i * 64  + 160,
                name: 'Firefox',
                itemStyle: { normal: { color: '#fc8b37' } }
              }
            ]
          };
          series.push(options);
        }

        return series;
      })()
    };
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setBarOptions() {
    this.barOptions = {
      color: ['#7cdb86', '#fc8b37', '#805aff'],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          show: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
        },
      ],
      series: [
        {
          name: 'Forest',
          type: 'bar',
          smooth: true,
          barWidth: '7px',
          barMaxWidth: '10px',
          barGap: '1px',
          data: [320, 332, 301, 334, 390, 420, 430, 400],
          itemStyle: {
            barBorderRadius: 50,
          },
        },
        {
          name: 'Steppe',
          type: 'bar',
          barWidth: '7px',
          barMaxWidth: '10px',
          data: [220, 182, 191, 234, 290, 320, 380, 370],
          itemStyle: {
            barBorderRadius: 50,
          },
        },
        {
          name: 'Desert',
          type: 'bar',
          barWidth: '7px',
          barMaxWidth: '10px',
          data: [150, 232, 201, 154, 190, 210, 240, 230],
          itemStyle: {
            barBorderRadius: 50,
          },
        },
      ],
    };
  }

  setLineOptions() {
    this.lineOptions = {
      color: ['#f741b5'],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        boundaryGap: false,
        show: true,
        type: 'category',
        data: ['Dec 7-18', 'Dec 21-26', 'Dec 28 - Jan 2', 'Jan 4-9', 'Jan 11-16', 'Jan 18-23', 'Jan 25-30', 'Feb 1-6']
      },
      yAxis: {
        show: false
      },
      tooltip: {
        trigger: 'axis'
      },
      series: [
        {
          name: 'Attendance',
          type: 'line',
          data: [144, 129, 139, 134, 135, 142, 133, 121],
          smooth: true,
          symbol: 'none',
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(247,86,189,0.2)'
                },
                {
                  offset: 0.6,
                  color: 'rgba(242,142,206,0.2)'
                },
                {
                  offset: 1,
                  color: 'rgba(249,227,241,0.2)'
                }
              ])
            }
          },
          markLine: {
            symbol: ['emptyCircle'],
            itemStyle: {
              normal: {
                color: '#d69f9f',
                lineStyle: {
                  type: 'solid'
                }
              }
            },
            data: [
              [
                { xAxis: 'Dec 21-26', yAxis: 50 },
                { xAxis: 'Dec 21-26', yAxis: 140 }
              ],
              [
                { xAxis: 'Dec 28 - Jan 2', yAxis: 50 },
                { xAxis: 'Dec 28 - Jan 2', yAxis: 140 }
              ],
              [
                { xAxis: 'Jan 4-9', yAxis: 50 },
                { xAxis: 'Jan 4-9', yAxis: 140 }
              ],
              [
                { xAxis: 'Jan 11-16', yAxis: 50 },
                { xAxis: 'Jan 11-16', yAxis: 140 }
              ],
              [
                { xAxis: 'Jan 18-23', yAxis: 50 },
                { xAxis: 'Jan 18-23', yAxis: 140 }
              ],
              [
                { xAxis: 'Jan 25-30', yAxis: 50 },
                { xAxis: 'Jan 25-30', yAxis: 140 }
              ]
            ]
          }
        }
      ]
    };
  }

  setPiOptions() {
    this.piOptions = {
      color: ['#c565e7'],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          name: 'Patients 2019',
          step: false,
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [
            95,
            180,
            220,
            180,
            142,
            103,
            143,
            243,
            304,
            243,
            144,
            107,
            141,
            226,
          ],
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#c565e7',
                },
                {
                  offset: 0.6,
                  color: '#d5ade4',
                },
                {
                  offset: 1,
                  color: '#f8e5ff',
                },
              ]),
            },
          },
        },
      ],
    };
  }

  setPi2Options() {
    this.pi2Options = {
      ...this.piOptions,
      ...{
        color: ['#47bf62'],
        series: [
          {
            name: 'Income in month',
            step: false,
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: [
              95,
              202,
              240,
              202,
              142,
              103,
              143,
              243,
              304,
              243,
              144,
              107,
              141,
              226,
            ],
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(71, 191, 98, .3)',
                  },
                  {
                    offset: 0.6,
                    color: 'rgba(98, 234, 129, .2)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(111, 219, 136, .1)',
                  },
                ]),
              },
            },
          },
        ],
      },
    };
  }

  setPieOptions() {
    this.pieOptions = {
      color: ['#f741b5', '#2fa7ff', '#7cdb86'],
      series: [
        {
          type: 'pie',
          radius: ['90%', '88%'],
          label: {
            show: false,
          },
          data: [
            { value: 250 },
            { value: 500 },
            { value: 250 }
          ],
          markPoint : {
            data : [
              {
                x: '50%',
                y: '10px',
                symbol: 'emptyCircle',
                symbolSize: 15,
                itemStyle: {
                  normal: {
                    color: 'rgba(247,65,181,0.1)',
                    borderWidth: 5
                  }
                }
              },
              {
                x: '50%',
                y: '10px',
                symbol: 'circle',
                symbolSize: 5,
                itemStyle: {
                  normal: {
                    color: '#F741B5'
                  }
                }
              },
              {
                x: '170px',
                y: '50%',
                symbol: 'emptyCircle',
                symbolSize: 15,
                itemStyle: {
                  normal: {
                    color: 'rgba(47,167,255,0.1)',
                    borderWidth: 5
                  }
                }
              },
              {
                x: '170px',
                y: '50%',
                symbol: 'circle',
                symbolSize: 5,
                itemStyle: {
                  normal: {
                    color: '#2fa7ff'
                  }
                }
              },
              {
                x: '10px',
                y: '50%',
                symbol: 'emptyCircle',
                symbolSize: 15,
                itemStyle: {
                  normal: {
                    color: 'rgba(124,219,134,0.1)',
                    borderWidth: 5
                  }
                }
              },
              {
                x: '10px',
                y: '50%',
                symbol: 'circle',
                symbolSize: 5,
                itemStyle: {
                  normal: {
                    color: '#7cdb86'
                  }
                }
              }
            ]
          }
        }
      ]
    };
  }
}
