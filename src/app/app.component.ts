import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'MDSG';

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('kz');
    this.translateService.use(localStorage.getItem('language') || 'kz');
  }

}
