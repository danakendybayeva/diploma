import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../../services/http/http.service';
import { AuthenticationService } from '../../../user/_services/authentication.service';
import {Skills} from '../../../interfaces/services/projects/skills.service';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Student} from '../../../interfaces/services/student.service';
import {Status} from '../../../interfaces/services/util.service';
import {UserService} from '../../../user/_services/user.service';

@Component({
  selector: 'actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  notifications: any[];
  closeDropdown: EventEmitter<boolean>;

  @Input() layout: string;

  userImage = 'assets/content/avatar-default.png';
  isAdmin = false;

  languages = [];
  language = { title: environment.defaultLanguage, img: '', value: environment.defaultLanguage };

  constructor(
    private httpSv: HttpService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.notifications = [];
    this.closeDropdown = new EventEmitter<boolean>();
    this.layout = 'vertical';
  }

  async ngOnInit() {
    this.getUserData();
    // this.getData('assets/data/navbar-notifications.json', 'notifications');
    // this.language = { title: environment.defaultLanguage, img: '', value: localStorage.getItem('language') };
    if (!localStorage.getItem('language')) {
      this.language = { title: environment.defaultLanguage, img: '', value: environment.defaultLanguage };
      localStorage.setItem('language', environment.defaultLanguage.toString().toLowerCase());
    }
    this.getData('assets/data/languages.json', 'languages');
    this.isAdmin = await this.userService.isAdmin();
  }
  // notification
  getData(url: string, dataName: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this[dataName] = data;
        if (dataName === 'languages') {
          for (let i = 0; i < this.languages.length; i++) {
            if (this.languages[i].value === localStorage.getItem('language')) {
              this.language = this.languages[i];
              break;
            }
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getUserData() {
    return this.http.get<Status>(`${environment.apiUrl}/api/v2/profiles/user-avatar`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.status === 1) {
            this.userImage = environment.apiUrl + data.message;
          }
        });
  }

  onCloseDropdown() {
    this.closeDropdown.emit(true);
  }

  goTo(event: Event, link: string, layout: string = '') {
    event.preventDefault();

    this.onCloseDropdown();
    if (link === 'sign-in') {
      this.authenticationService.logout();
    }

    setTimeout(() => {
      this.router.navigate([layout ? layout : this.layout, link], {queryParams: { tabindex: 2 } });
    });
  }

  setLanguage(value: String) {
    localStorage.setItem('language', value.toString().toLowerCase());
    location.reload(true);
  }
}
