// import {Component, Input, OnInit} from '@angular/core';
// import {BasePageComponent} from '../base-page';
// import {Store} from '@ngrx/store';
// import {IAppState} from '../../interfaces/app-state';
// import {HttpService} from '../../services/http/http.service';
// import {FormBuilder, FormGroup} from '@angular/forms';
// import {IMenuItemIcon, Menu} from '../../interfaces/main-menu';
// import {environment} from '../../../environments/environment';
// import * as PageActions from '../../store/actions/page.actions';
// import {Topic} from '../../interfaces/services/projects/community.service';
// import {map} from 'rxjs/operators';
// import {Status} from '../../interfaces/services/util.service';
// import {HttpClient} from '@angular/common/http';
// import {ActivatedRoute, Router} from '@angular/router';
// import {ToastrService} from 'ngx-toastr';
//
// @Component({
//     selector: 'my-menu',
//     templateUrl: './menu.component.html',
//     styleUrls: ['./menu.component.css']
// })
// export class MyMenuComponent extends BasePageComponent implements OnInit {
//
//     successCode = '';
//     errorCode = '';
//     // companyId = '';
//     // id = '';
//
//     menuChecked = true;
//     groupChecked = true;
//
//     menus: Menu[] = [];
//     group: Menu[] = [];
//     roles: string[] = [];
//     routing: string[] = [];
//
//     constructor(store: Store<IAppState>,
//                 private formBuilder: FormBuilder,
//                 private http: HttpClient, private router: Router,
//                 private route: ActivatedRoute, private toastr: ToastrService,
//                 httpSv: HttpService) {
//         super(store, httpSv);
//         this.pageData = {
//             title: 'Menu',
//             loaded: true
//         };
//         // this.companyId = this.route.snapshot.params['companyId'];
//         // this.id = this.route.snapshot.params['id'];
//
//         this.successCode = 'Successfully saved!';
//         this.errorCode = 'Not saved!';
//     }
//
//     ngOnInit() {
//         super.ngOnInit();
//         this.getMenus();
//         this.getRolesAndRouting();
//     }
//
//     addMenu() {
//         this.menus.push({id: '', icon: '', typeMenu: 1, title: '', parentId: null, orderNum: 1, roles: [], hidden: false, sub: []});
//         for (let i = 0; i < this.menus.length; i++) {
//             this.menus[i].hidden = true;
//         }
//     }
//
//     addGroup() {
//         this.group.push({id: '', typeMenu: 0, title: '', parentId: null, orderNum: 1, roles: [], hidden: false, sub: []});
//     }
//
//     initTable(): void {
//         setTimeout(
//             () => this.store.dispatch(new PageActions.Update({loaded: true})),
//             0
//         );
//     }
//
//     getMenus() {
//         this.initTable();
//         return this.http.get<Menu[]>(`${environment.apiUrl}/api/menu/list`)
//             .pipe(map(data => {
//                 return data;
//             }))
//             .subscribe(data => {
//                 this.menus = data;
//                 if (data.length === 0) {
//                     this.menus.push({
//                         id: '',
//                         icon: '',
//                         typeMenu: 1,
//                         title: '',
//                         parentId: null,
//                         orderNum: 1,
//                         roles: [],
//                         hidden: false,
//                         sub: []
//                     });
//                 } else {
//                     for (let i = 0; i < data.length; i++) {
//                         if (data[i].typeMenu) {
//                             this.group.push(data[i]);
//                         } else if (data[i].typeMenu) {
//                             data[i].sub = [];
//                             data[i].hidden = true;
//                             this.menus.push(data[i]);
//                         }
//                     }
//                 }
//                 this.subMenuData();
//             });
//     }
//
//     subMenuData() {
//         for (let i = 0; i < this.menus.length; i++) {
//             if (this.menus[i].parentId == null || this.menus[i].parentId === '') {
//                 continue;
//             }
//             const itemIndex = this.menus.findIndex(menu => menu.id === this.menus[i].parentId);
//             if (this.menus[itemIndex] !== undefined) {
//                 this.menus[itemIndex].sub.push(this.menus[i]);
//             }
//         }
//         for (let i = this.menus.length - 1; i >= 0; i--) {
//             if (this.menus[i].parentId == null || this.menus[i].parentId === '') {
//                 this.menus.splice(i, 1);
//             }
//         }
//     }
//
//     // TODO backend
//     getRolesAndRouting() {
//         this.getRoles();
//         this.getRouting();
//     }
//
//     getRoles() {
//         // return this.http.get<string[]>(`${environment.apiUrl}/api/menu/roles`)
//         //     .pipe(map(data => {
//         //         return data;
//         //     }))
//         //     .subscribe(data => {
//         //         this.roles = data;
//         //     });
//     }
//
//     getRouting() {
//         // return this.http.get<string[]>(`${environment.apiUrl}/api/menu/routing`)
//         //     .pipe(map(data => {
//         //         return data;
//         //     }))
//         //     .subscribe(data => {
//         //         this.routing = data;
//         //     });
//     }
//
//
//     // saveMenuGroup() {
//     //     let sUrl = `${environment.apiUrl}/api/menu/new`;
//     //     if (this.id && this.id !== '') {
//     //         sUrl = `${environment.apiUrl}/api/menu/update`;
//     //     }
//     //     return this.http.post<Status>(sUrl, this.menus)
//     //         .subscribe({
//     //             next: data => {
//     //                 if (data.status === 1) {
//     //                     this.toastr.success('Saved!', 'Success', {closeButton: true});
//     //                 } else {
//     //                     this.toastr.error(data.message, 'Error', {closeButton: true});
//     //                 }
//     //             },
//     //             error: error => {
//     //                 this.toastr.error('Not saved!', 'Error', {closeButton: true});
//     //             }
//     //         });
//     // }
//
//     view() {
//     }
//
//     role() {
//     }
// }
