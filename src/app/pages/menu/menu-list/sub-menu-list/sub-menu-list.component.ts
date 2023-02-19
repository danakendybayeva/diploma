import {Component, Input, OnInit} from '@angular/core';
import {Menu} from '../../../../interfaces/main-menu';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Content} from '../../../../ui/interfaces/modal';
import {environment} from '../../../../../environments/environment';
import {Status} from '../../../../interfaces/services/util.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'submenu-list',
  templateUrl: './sub-menu-list.component.html',
  styleUrls: ['./sub-menu-list.component.css']
})
export class SubMenuListComponent implements OnInit {
  @Input() data: Menu[] = [];
  @Input() routing1: string[] = [];
  @Input() role1: string[] = [];

  index;
  successColor = 'success';
  successIcon = 'icofont-check tc-icon-wrap';
  waitColor = 'info';
  waitIcon = 'icofont-save tc-icon-wrap';
  color = [];
  icon = [];
  routing: any[] = [
    {value: 1, label: './rout/examples'},
    {value: 2, label: './rout/examples2'}
  ];
  role: any[] = [
    {value: 1, label: 'Admin'},
    {value: 2, label: 'Nurzhan'},
  ];
  iconString = 'icofont-caret-left tc-icon-wrap';
  icons: any[] = [
    {value: 1, label: ''},
    {value: 2, label: ''}
  ];


  constructor(private modal: TCModalService,
              private http: HttpClient,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  saveTopic(menu: Menu, i: number) {
    let sUrl = `${environment.apiUrl}/api/menu/new`;
    if (menu.id && menu.id !== '') {
      sUrl = `${environment.apiUrl}/api/menu/update`;
    }
    return this.http.post<Status>(sUrl, menu)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success('Saved!', 'Success', { closeButton: true });
              this.color[i] = this.successColor;
              this.icon[i] = this.successIcon;
              menu.id = data.value;
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  removeMenu(i: number) {
    // if (this.data[i].id != null && this.data[i].id !== '') {
    //   this.http.delete<Status>(`${environment.apiUrl}/api/project/community/topic/delete/${this.data[i].id}`)
    //       .subscribe({
    //         next: data => {
    //           if (data.status === 1) {
    //             this.toastr.success(data.message, 'Success', { closeButton: true });
    //             this.data.splice(i, 1);
    //             this.color.splice(i, 1);
    //             this.icon.splice(i, 1);
    //           } else {
    //             this.toastr.success(data.message, 'Warning', { closeButton: true });
    //           }
    //         },
    //         error: error => {
    //           this.toastr.error('Not saved!', 'Error', { closeButton: true });
    //         }
    //       });
    // } else {
    this.data.splice(i, 1);
    this.color.splice(i, 1);
    this.icon.splice(i, 1);
    // }

    this.modal.close();
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.data[i].orderNum = i + 1;
  //   }
  //   this.topicList();
  // }
  //
  // topicList() {
  //   this.http.post(`${environment.apiUrl}/api/project/community/topic/update/order`, this.data)
  //       .subscribe({
  //         next: data => console.log('success => ' + data),
  //         error: error => console.log('Error => ' + error)
  //       });
  // }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null, index = -1) {
    this.index = index;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  closeModal() {
    this.modal.close();
  }

  saveMenu(item: Menu, index: number) {

  }
}
