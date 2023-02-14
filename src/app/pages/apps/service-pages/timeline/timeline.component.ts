import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EChartOption } from 'echarts';
import { BasePageComponent } from '../../../base-page';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { ITimelineBox } from '../../../../ui/interfaces/timeline';

@Component({
  selector: 'page-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class PageTimelineComponent extends BasePageComponent implements OnInit, OnDestroy {
  piOptions: EChartOption;
  timelineData: ITimelineBox[];
  lastPayments: any[];
  lastClients: any[];

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Events timeline',
      breadcrumbs: [
        {
          title: 'Apps',
          route: 'dashboard'
        },
        {
          title: 'Service pages',
          route: 'dashboard'
        },
        {
          title: 'Events timeline'
        }
      ]
    };
    this.lastPayments = [
      {
        date: '24 May 2019',
        amount: '$155'
      },
      {
        date: '23 May 2019',
        amount: '$365'
      },
      {
        date: '22 Feb 2019',
        amount: '$234'
      },
      {
        date: '21 May 2019',
        amount: '$190'
      }
    ];
    this.lastClients = [
      {
        date: '23 May 2019',
        client: {
          name: 'Liam',
          img: 'assets/content/user-40-1.jpg'
        }
      },
      {
        date: '22 May 2019',
        client: {
          name: 'Emma',
          img: 'assets/content/user-40-2.jpg'
        }
      },
      {
        date: '21 May 2019',
        client: {
          name: 'Olivia',
          img: 'assets/content/user-40-3.jpg'
        }
      },
      {
        date: '20 May 2019',
        client: {
          name: 'Ava',
          img: 'assets/content/user-40-4.jpg'
        }
      },
      {
        date: '19 May 2019',
        client: {
          name: 'Sam',
          img: 'assets/content/user-40-5.jpg'
        }
      }
    ];
  }

  ngOnInit() {
    super.ngOnInit();

    this.getData('assets/data/events-timeline.json', 'timelineData', 'setLoaded');

    this.piOptions = {
      color: ['#fff'],
      grid: {
        left: 5,
        right: 5,
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
          name: 'Income this week',
          type: 'line',
          smooth: true,
          data: [60, 124, 132, 143, 138, 178, 194, 211, 234, 257, 241, 226],
          areaStyle: {},
          markLine: {
            data: [
              { type: 'average', name: 'Average' }
            ]
          }
        }
      ]
    };
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
