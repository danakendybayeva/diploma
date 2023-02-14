import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../../base-page';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { TCModalService } from '../../../../ui/services/modal/modal.service';
import { Content } from '../../../../ui/interfaces/modal';

import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'page-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class PageCalendarComponent extends BasePageComponent implements OnInit, OnDestroy {
  calendarEvents: any[];
  eventBody: any;
  headerOptions: any;

  @ViewChild('modalBody', { static: true }) modalBodyTpl: TemplateRef<any>;
  @ViewChild('modalFooter', { static: true }) modalFooterTpl: TemplateRef<any>;

  calendarPlugins = [dayGridPlugin];

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Events calendar',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Apps',
          route: 'default-dashboard',
        },
        {
          title: 'Service pages',
          route: 'default-dashboard',
        },
        {
          title: 'Events calendar',
        },
      ],
    };

    this.headerOptions = {
      left: 'prev,next today ',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay, dayGriList',
    };

    this.calendarEvents = [
      {
        title: 'Project review',
        color: '#fc8b37',
        start: this.setDate(0, 2),
        end: this.setDate(0, 3),
        desc:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      },
      {
        title: 'Project review',
        start: this.setDate(1, -1),
        end: this.setDate(1, 3),
        desc:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      },
      {
        title: 'Meeting',
        color: '#2fa7ff',
        start: this.setDate(1),
        end: this.setDate(1, 3),
        desc:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      },
      {
        title: 'Event',
        color: '#7cdb86',
        start: this.setDate(1, -3),
        end: this.setDate(1, -2),
        desc:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      },
      {
        title: 'Long event',
        color: '#f741b5',
        textColor: '#000',
        start: this.setDate(3, -5),
        end: this.setDate(4),
        desc:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      },
      {
        title: 'Event',
        color: '#f741b5',
        textColor: '#000',
        start: this.setDate(5, 10),
        end: this.setDate(6),
        desc:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      },
    ];
  }

  ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setDate(day: number, hour: number = 0) {
    const date = new Date();

    date.setDate(date.getDate() + day);
    date.setHours(date.getHours() + hour);

    return date;
  }

  dateFormat(date: any) {
    return date.toString().slice(4, 21);
  }

  eventClick(data: any) {
    this.eventBody = {
      title: data.event.title,
      color: data.event.backgroundColor,
      from: this.dateFormat(data.event.start),
      to: this.dateFormat(data.event.end),
      desc: data.event.extendedProps.desc
    };
    this.openModal(this.modalBodyTpl, null, this.modalFooterTpl);
  }

  // open modal window
  openModal<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    options: any = null
  ) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options,
    });
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.eventBody = {};
  }
}
