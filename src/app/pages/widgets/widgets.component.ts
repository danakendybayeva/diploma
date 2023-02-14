import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import { IUser } from '../../ui/interfaces/user';

@Component({
  selector: 'page-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class PageWidgetsComponent extends BasePageComponent implements OnInit, OnDestroy {
  skills: string[];
  education: any[];
  users: IUser[];
  usersData: any[];
  ordersData: any[];

  constructor(store: Store<IAppState>, httpSv: HttpService) {
    super(store, httpSv);

    this.pageData = {
      title: 'Widgets',
      breadcrumbs: [
        {
          title: 'Home',
          route: 'dashboard',
        },
        {
          title: 'Widgets',
        },
      ],
    };
    this.skills = ['html', 'php', 'css', 'scss', 'js', 'Angular', 'React', 'Vue.js', 'Javascript', 'Typescript'];
    this.education = [
      {
        'sectionData': [
          {
            date: '2008 - 2009',
            content: '<strong>Special schools</strong> - Edison Schools',
            iconBg: '#ed5564'
          },
          {
            date: '2007 - 2008',
            content: '<strong>Technical schools</strong> - Jules E. Mastbaum Technical High School',
            iconBg: '#cd5447'
          },
          {
            date: '2005 - 2007',
            content: '<strong>High schools</strong> - Benjamin Franklin High School',
            iconBg: '#ED6C9C'
          }
        ]
      }
    ];
    this.users = [
      {
        'bg': 'assets/content/bg-card-2.jpg',
        'name': 'Anna Smith',
        'role': 'Manager',
        'img': 'assets/content/user-76-2.jpg'
      },
      {
        'bg': 'assets/content/bg-card-3.jpg',
        'name': 'Barbara  Jones',
        'role': 'Designer',
        'img': 'assets/content/user-76-3.jpg'
      },
      {
        'bg': 'assets/content/bg-card-4.jpg',
        'name': 'Daisy Anderson',
        'role': 'Software engineer',
        'img': 'assets/content/user-76-4.jpg'
      }
    ];
    this.usersData = [];
    this.ordersData = [];
  }

  ngOnInit() {
    super.ngOnInit();

    this.getData('assets/data/recent-orders.json', 'ordersData');
    this.getData('assets/data/table.json', 'usersData', 'setLoaded');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
