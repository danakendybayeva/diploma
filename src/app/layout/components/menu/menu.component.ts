import { Component, HostBinding, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { HttpService } from '../../../services/http/http.service';
import { IMenuItem } from '../../../interfaces/main-menu';
import * as SettingsActions from '../../../store/actions/app-settings.actions';
import { IAppState } from '../../../interfaces/app-state';
import * as PageActions from '../../../store/actions/page.actions';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { IAppSettings } from 'src/app/interfaces/settings';
import {Status} from '../../../interfaces/services/util.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../user/_services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('subMenu', [
      state(
        'active',
        style({
          height: '*',
          visibility: 'visible',
        })
      ),
      state(
        'inactive',
        style({
          height: 0,
          visibility: 'hidden',
        })
      ),
      transition('inactive => active', animate('300ms ease-in-out')),
      transition('active => inactive', animate('200ms ease-in-out')),
    ]),
  ],
})
export class MenuComponent implements OnInit, OnDestroy {
  @HostBinding('class.main-menu') true;
  @HostBinding('class.horizontal') get horizontal() {
    return this.orientation === 'horizontal';
  }
  @HostBinding('class.vertical') get vertical() {
    return this.orientation === 'vertical';
  }

  @Input() orientation: string;
  @Input() src: string;

  routerSubscription: Subscription;
  settings: IAppSettings;
  menuItems: IMenuItem[];
  contrastColor: string;
  accentColor: string;
  navColor: string;
  caret: string;
  roles: string;

  isAdmin = false;

  constructor(
    private httpSv: HttpService,
    private store: Store<IAppState>,
    private router: Router,
    private elementRef: ElementRef,
    private userService: UserService,
  ) {
    this.caret = 'icofont-rounded-right';
    this.orientation = 'vertical';
    this.store.pipe(select('appSettings')).subscribe((settings: IAppSettings) => {
      this.settings = settings;

      this.elementRef.nativeElement.style.cssText = `
        --accent: ${ this.settings.sidebarAccentColor };
        --accent-contrast: ${ this.settings.sidebarAccentContrastColor };
        --sub-menu-bg: ${ this.settings.sidebarBg };
      `;
    });
  }

  async ngOnInit() {
    this.isAdmin = await this.userService.isAdmin();
    this.roles = await this.userService.getRolesAccount();

    this.getMenuData(this.src);

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.setActiveItem());
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  getMenuData(url: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this.menuItems = data;
        if (!this.isAdmin) {
          const menuAccess: IMenuItem[] = [];
          this.menuItems.forEach(item => {
            if (item.access && item.access.length > 0) {
              if (item.access.filter(x => this.roles.includes(x)).length > 0) {
                menuAccess.push(item);
              }
            } else {
              menuAccess.push(item);
            }
          });
          this.menuItems = menuAccess;
        }
        this.setActiveItem();
      },
      err => {
        console.log(err);
      }
    );
  }

  toggle(event: Event, item: any, el: any) {
    event.preventDefault();

    const ITEMS: any[] = el.menuItems;

    if (item.active) {
      item.active = false;
    } else {
      for (let i = 0; i < ITEMS.length; i++) {
        ITEMS[i].active = false;
      }

      item.active = true;
    }

    this.changeRoute(
      item.routing,
      !item.sub && !this.isActive([this.orientation, item.routing]),
      item.layout ? item.layout : this.orientation
    );
  }

  setActiveItem() {
    this.menuItems.filter(item => item.sub).forEach(item => {
      item.sub.forEach(subItem => {
        if (this.isActive([this.orientation, subItem.routing])) {
          this.closeAll();
          item.active = true;
          return;
        }
      });
    });
  }

  subState(item: IMenuItem, rla: boolean) {
    return item.active || rla ? 'active' : 'inactive';
  }

  closeAll() {
    this.menuItems.forEach(item => {
      item.active = false;

      this.closeSub(item);
    });
  }

  closeSub(item: IMenuItem) {
    if (item.sub && item.sub.length) {
      item.sub.forEach(subItem => {
        subItem.active = false;
      });
    }
  }

  closeSidebar() {
    this.store.dispatch(new SettingsActions.SidebarState(false));
  }

  getLayout(): string {
    const url = this.router.url.split('/').filter(n => n);
    return url[0];
  }

  // change route
  changeRoute(
    routing: string,
    bool: boolean = true,
    layout: string = this.orientation
  ) {
    if (bool) {
      this.store.dispatch(new PageActions.Reset());

      setTimeout(() => {
        if (routing.indexOf('/') >= 0) {
          this.router.navigateByUrl(`/${layout}/${routing}`);
        } else {
          this.router.navigate([`./${layout}`, routing]);
        }
      }, 0);
    }
  }

  isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), true);
  }

  getAccentColor(item: IMenuItem): any {
    const IS_ACTIVE = item.active || this.isActive([this.orientation, item.routing]);

    return IS_ACTIVE ? { color: this.settings.sidebarAccentColor } : {};
  }

  getItemColor(item: IMenuItem, show: boolean = false): any {
    const IS_ACTIVE = item.hovered || item.active || this.isActive([this.orientation, item.routing]);

    if (!IS_ACTIVE || show) {
      return { color:  this.navColor };
    }

    return { color: this.accentColor };
  }

  getAccentBg(active: boolean = false): any {
    if (!active) {
      return null;
    }

    return {
      'background-color': this.accentColor,
    };
  }

  setAccentColor() {

  }
}
