// import {Component, Input, OnInit, TemplateRef} from '@angular/core';
// import {Menu} from '../../../interfaces/main-menu';
// import {TCModalService} from '../../../ui/services/modal/modal.service';
// import {HttpClient} from '@angular/common/http';
// import {ToastrService} from 'ngx-toastr';
// import {Content} from '../../../ui/interfaces/modal';
// import {Topic} from '../../../interfaces/services/projects/community.service';
// import {environment} from '../../../../environments/environment';
// import {Status} from '../../../interfaces/services/util.service';
//
// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'menu-list',
//   templateUrl: './menu-list.component.html',
//   styleUrls: ['./menu-list.component.css']
// })
// export class MenuListComponent implements OnInit {
//   @Input() data: Menu[] = [];
//
//   index;
//   successColor = 'success';
//   successIcon = 'icofont-check tc-icon-wrap';
//   waitColor = 'info';
//   waitIcon = 'icofont-save tc-icon-wrap';
//   iconString = 'icofont-caret-left tc-icon-wrap';
//   color = [];
//   icon = [];
//   typeMenu: any[] = [
//     {value: 1, label: 'Group Title'},
//     {value: 2, label: 'Menu'},
//     {value: 3, label: 'SubMenu'},
//   ];
//
//   role: any[] = [
//     {value: 1, label: 'Admin'},
//     {value: 2, label: 'Nurzhan'},
//   ];
//
//   icons: any[] = [
//     {value: 1, label: ''},
//     {value: 2, label: ''}
//   ];
//   typeSubMenu: any[] = [
//     {value: 1, label: 'Routing'},
//     {value: 2, label: 'SubMenu'},
//   ];
//   routing: any[] = [
//     {value: 1, label: './rout/examples'},
//     {value: 2, label: './rout/examples2'}
//   ];
//
//
//   constructor(private modal: TCModalService,
//               private http: HttpClient,
//               private toastr: ToastrService) {
//   }
//
//   ngOnInit(): void {
//   }
//
//   openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null, index = -1) {
//     this.index = index;
//     this.modal.open({
//       body: body,
//       header: header,
//       footer: footer,
//       options: options
//     });
//   }
//
//   closeModal() {
//     this.modal.close();
//   }
//
//   // TODO saveMenu
//   // saveTopic(topic: Topic, i: number) {
//   //     let sUrl = `${environment.apiUrl}/api/project/community/topic/new`;
//   //     if (topic.id && topic.id !== '') {
//   //         sUrl = `${environment.apiUrl}/api/project/community/topic/update`;
//   //     }
//   //     return this.http.post<Status>(sUrl, topic)
//   //         .subscribe({
//   //             next: data => {
//   //                 if (data.status === 1) {
//   //                     this.toastr.success('Saved!', 'Success', { closeButton: true });
//   //                     this.color[i] = this.successColor;
//   //                     this.icon[i] = this.successIcon;
//   //                     topic.id = data.value;
//   //                 } else {
//   //                     this.toastr.error(data.message, 'Error', { closeButton: true });
//   //                 }
//   //             },
//   //             error: error => {
//   //                 this.toastr.error('Not saved!', 'Error', { closeButton: true });
//   //             }
//   //         });
//   // }
//   saveMenu(item: Menu, index: number) {
//     console.log('Menu save');
//   }
//
//   addSubMenu(sub: Menu[], parentId: string, pos: number) {
//     this.data[pos].hidden = false;
//     this.iconString = 'icofont-caret-down tc-icon-wrap';
//     sub.push({id: '', typeMenu: null, title: '', parentId: parentId, orderNum: 1, roles: [], hidden: false});
//   }
//
//   removeMenu(i: number) {
//     // if (this.data[i].id != null && this.data[i].id !== '') {
//     //   this.http.delete<Status>(`${environment.apiUrl}/api/project/community/topic/delete/${this.data[i].id}`)
//     //       .subscribe({
//     //         next: data => {
//     //           if (data.status === 1) {
//     //             this.toastr.success(data.message, 'Success', { closeButton: true });
//     //             this.data.splice(i, 1);
//     //             this.color.splice(i, 1);
//     //             this.icon.splice(i, 1);
//     //           } else {
//     //             this.toastr.success(data.message, 'Warning', { closeButton: true });
//     //           }
//     //         },
//     //         error: error => {
//     //           this.toastr.error('Not saved!', 'Error', { closeButton: true });
//     //         }
//     //       });
//     // } else {
//     this.data.splice(i, 1);
//     this.color.splice(i, 1);
//     this.icon.splice(i, 1);
//     // }
//
//     this.modal.close();
//   }
//
//   toggle(index: number) {
//     this.data[index].hidden = !this.data[index].hidden;
//     if (this.data[index].hidden) {
//       this.iconString = 'icofont-caret-left tc-icon-wrap';
//     } else {
//       this.iconString = 'icofont-caret-down tc-icon-wrap';
//     }
//   }
//
//   change(a: Menu) {
//     console.log(a);
//     console.log(a.typeMenu);
//   }
// }
