import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { IOption } from '../../../ui/interfaces/option';
import { IAppState } from '../../../interfaces/app-state';
import { IAppSettings } from '../../../interfaces/settings';
import { environment } from '../../../../environments/environment';
import * as SettingsActions from '../../../store/actions/app-settings.actions';

const LAYOUTS: IOption[] = [
  {
    label: 'Vertical',
    value: 'vertical',
  },
  {
    label: 'Horizontal',
    value: 'horizontal',
  },
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  layouts: IOption[];
  defaultSettings: IAppSettings;
  settings: IAppSettings;
  downloadJsonHref: SafeUrl;

  constructor(
    private store: Store<IAppState>,
    private sanitizer: DomSanitizer,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.layouts = LAYOUTS;
    this.defaultSettings = environment.appSettings;
  }

  ngOnInit() {
    this.store.select('appSettings').subscribe(st => {
      if (st) {
        this.settings = st;
        this.settings.layout = this.getLayout();

        if (!this.form) {
          this.initSettingsForm(st);
        }

        this.downloadSettings(st);
      }
    });
  }

  initSettingsForm(data: IAppSettings) {
    this.form = this.formBuilder.group({
      boxed: data.boxed,
      layout: data.layout,
      topbarBg: data.topbarBg,
      topbarColor: data.topbarColor,
      sidebarBg: data.sidebarBg,
      sidebarBg2: data.sidebarBg2,
      sidebarColor: data.sidebarColor,
      sidebarAccentColor: data.sidebarAccentColor,
      sidebarAccentContrastColor: data.sidebarAccentContrastColor
    });

    this.form.valueChanges.pipe().subscribe(newData => {
      if (data.layout !== newData.layout) {
        this.changeLayout(newData.layout);
        data.layout = newData.layout;
      }

      if (data.boxed !== newData.boxed) {
        this.changeBoxed(newData.boxed);
        data.boxed = newData.boxed;
      }
    });
  }

  resetSettings(data: IAppSettings = this.defaultSettings) {
    this.store.dispatch(new SettingsActions.Reset());

    this.form.patchValue({
      boxed: data.boxed,
      layout: data.layout,
      topbarBg: data.topbarBg,
      topbarColor: data.topbarColor,
      sidebarBg: data.sidebarBg,
      sidebarBg2: data.sidebarBg2,
      sidebarColor: data.sidebarColor,
      sidebarAccentColor: data.sidebarAccentColor,
      sidebarAccentContrastColor: data.sidebarAccentContrastColor
    });
  }

  downloadSettings(settings: IAppSettings) {
    const JSON_FILE = JSON.stringify(settings);
    const URI = this.sanitizer.bypassSecurityTrustUrl(
      `data:text/json;charset=UTF-8, ${encodeURIComponent(JSON_FILE)}`
    );

    this.downloadJsonHref = URI;
  }

  getLayout() {
    const url = this.router.url.split('/').filter(n => n);
    const layout = url[0];

    return layout;
  }
  // update layout value in app store
  changeLayout(layout: string) {
    this.store.dispatch(new SettingsActions.Update({ layout: layout }));

    const url = this.router.url.split('/').filter(n => n);

    url[0] = layout;

    const route = url.join('/');

    setTimeout(() => {
      this.router.navigate([route]);
    });
  }

  // update boxed value in app store
  changeBoxed(boxed: boolean) {
    this.store.dispatch(new SettingsActions.Update({ boxed: boxed }));
  }

  // update color in app store
  changeColor(value: any, name: string) {
    this.store.dispatch(
      new SettingsActions.Update({
        [name]: value.color
      })
    );
  }

  changeDoubleColor(value: any, name: string, contrastName: string): void {
    this.store.dispatch(
      new SettingsActions.Update({
        [name]: value.color,
        [contrastName]: value.contrast
      })
    );
  }

  getNavbarName(bool: boolean) {
    return bool ? 'Sidebar' : 'Second navbar';
  }
}
