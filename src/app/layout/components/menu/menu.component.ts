import { Component, HostBinding, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { Store, select } from '@ngrx/store';


import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { HttpService } from '../../../services/http/http.service';
import { IMenuItem } from '../../../interfaces/main-menu';
import * as SettingsActions from '../../../store/actions/app-settings.actions';
import { IAppState } from '../../../interfaces/app-state';
import * as PageActions from '../../../store/actions/page.actions';
import { DOCUMENT } from '@angular/common';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { IAppSettings } from 'src/app/interfaces/settings';
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
  color:"#FFFFFF";


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

    this.initRoute().then();
    this.onRouteChange();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  onRouteChange() {
    this.routerSubscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initRoute().then();
      }
    });
  }

  async initRoute() {
    this.getMenuDataApi(this.router.url);
  }

  getMenuData(url: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this.menuItems = data;
        if (!this.isAdmin) {
          const menuAccess: IMenuItem[] = [];
          this.menuItems.forEach(item => {
              // Sub menu begin
              if (item.sub && item.sub.length > 0) {
                const subs = [];
                item.sub.forEach(sub => {
                  if (sub.access && sub.access.length > 0) {
                    if (sub.access.filter(x => this.roles.includes(x)).length > 0) {
                      subs.push(sub);
                    }
                  } else {
                    subs.push(sub);
                  }
                });
                item.sub = subs;
              }
              // Sub menu end

              if (
                  (item.access && item.access.filter(x => this.roles.includes(x)).length > 0)
                  || !item.access
              ) {
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
          subItem.active = true;
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
      let routingArr: string[] = [layout];
      routingArr = routingArr.concat(routing.split('/'));
      setTimeout(() => {
        this.router.navigate(routingArr).then();
      }, 0);
    }
  }

  isActive(instruction: any[]): boolean {
    let routingArr = instruction;
    if (instruction.length >= 1 && routingArr[1]) {
        const secondUrl = routingArr[1].split('/');
        routingArr.splice(1, 1);
        routingArr = routingArr.concat(secondUrl);
    }
    return this.router.isActive(this.router.createUrlTree(routingArr), true);
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
  setActiveLine(acc:boolean): any {
    if (acc) {
      return 'currentMenu';
    }

    return null;
  }

  setAccentColor() {

  }


  getMenuDataApi(url: string) {
    if (
        url.indexOf('courses/course/module/view/') > -1
        || url.indexOf('courses/course/lesson/view/') > -1
        || url.indexOf('courses/course/quiz/view/') > -1
    ) {
      console.log(url);
    }
  }

  colorLine :any;

  setHoverColor(img: string){
    // console.log(img);
    // this.hoverColor= document.getElementById(img);
    // this.hoverColor.setAttribute('style','filter: brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(4382%) hue-rotate(194deg) brightness(113%) contrast(101%);')
    // this.hoverColor.style.filter = "#brightness(0) saturate(100%) invert(100%) sepia(1%) saturate(4382%) hue-rotate(194deg) brightness(113%) contrast(101%)";
  }

  setLine(img: any){
    console.log(img);
    // this.hoverColor= document.getElementById(img);

    // this.hoverColor= document.getElementById(img);
    // this.hoverColor.setAttribute('style','filter: brightness(0) saturate(100%) invert(7%) sepia(35%) saturate(2150%) hue-rotate(206deg) brightness(93%) contrast(97%);')
    // return this.hoverColor("fill","#10142D");
  }

}


