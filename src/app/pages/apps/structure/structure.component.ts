import {Component, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {
  NzTreeNode,
  NzTreeNodeOptions
} from 'ng-zorro-antd';
import {Content} from '../../../ui/interfaces/modal';
import {TCModalService} from '../../../ui/services/modal/modal.service';
import {Structure, userField} from '../../../interfaces/services/structure.service';
import {FormGroup} from '@angular/forms';
import {Status} from '../../../interfaces/services/util.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'page-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss'],
})
export class PageStructureComponent extends BasePageComponent implements OnInit {
  activedNode: NzTreeNode;
  nodes: NzTreeNodeOptions[] = [];
  selectedNode: NzTreeNodeOptions = null;
  labelForm: FormGroup;

  structure: Structure = {
    id: '',
    displayName: '',
    parentId: '',
    parent: [],
    profileId: '',
    type: '',
    manager: [],
    employee: [],
    sortOrder: 99999,
    childrenStructure: [],
    childrenCount: 0
  };

  managerIds = [];
  structures = {};
  isNew = true;
  userField = userField;
  loaded = false;

  isVisibleAddEmployee = false;
  isVisibleAddSubdivision = false;

  constructor(
      store: Store<IAppState>,
      httpSv: HttpService,
      private modal: TCModalService,
      private http: HttpClient,
      private toastr: ToastrService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Structure',
      loaded: true
    };

    this.labelForm = new FormGroup({});
  }

  searchValue = '';

  async ngOnInit() {
    super.ngOnInit();
    this.nodes = await this.getStructure();
    this.loaded = true;
  }

  getStructure(): Promise<NzTreeNodeOptions[]> {
    this.managerIds = [];
    return this.http.get<Structure[]>(`${environment.apiUrl}/api/structure/list/expanded`)
        .toPromise()
        .then(data => {
          return this.recursiveStructure(data, true);
        });
  }

  recursiveStructure(data: Structure[], expanded = false): NzTreeNodeOptions[] {
    const nodes: NzTreeNodeOptions[] = [];
    data.forEach(item => {
      nodes.push({
        title: item.displayName,
        key: item.id,
        expanded: expanded,
        icon: this.getIcon(item.type)
      });
      this.structures[item.id] = item;
      this.getManagers(item);
      const index = nodes.length - 1;
      if (item.childrenStructure.length) {
        nodes[index].children = this.recursiveStructure(item.childrenStructure);
        nodes[index].isLeaf = false;
      } else {
        nodes[index].isLeaf = true;
      }
    });
    return nodes;
  }

  dragEvent(event) {

  }

  openModal<T>(
      body: Content<T>,
      header: Content<T> = null,
      footer: Content<T> = null,
      options: any = null,
      type = 'subdivision',
      isNew = false
  ) {
    this.isNew = isNew;
    this.structure.type = type;
    this.loaded = true;
    this.structure.parentId = this.selectedNode.key;
    if (this.isNew) {
      this.structure.displayName = '';
      this.structure.manager = [];
      this.structure.employee = [];
    } else {
      if (this.structures[this.selectedNode.key]) {
        this.structure = this.structures[this.selectedNode.key];
        if (this.selectedNode.parentNode) {
          this.structure.parent = [{
            id: this.selectedNode.parentNode.origin.key,
            value: this.selectedNode.parentNode.origin.title
          }];
          this.structure.parentId = this.selectedNode.parentNode.origin.key;
        }
      } else {
        this.getManagerByKey(this.selectedNode.key);
      }
    }
    this.modal.open({
      body: body,
      header: null,
      footer: footer,
      options: options
    });
  }

  openModalEdit<T>(
      body: Content<T>,
      header: Content<T> = null,
      footer: Content<T> = null,
      options: any = null,
      type = 'subdivision',
      isNew = false
  ) {
    this.isNew = isNew;
    this.structure.type = type;
    this.loaded = true;
    this.structure.parentId = this.selectedNode.key;
    if (this.isNew) {
      this.structure.displayName = '';
      this.structure.manager = [];
      this.structure.employee = [];
    } else {
      if (this.structures[this.selectedNode.key]) {
        this.structure = this.structures[this.selectedNode.key];
        if (this.selectedNode.parentNode) {
          this.structure.parent = [{
            id: this.selectedNode.parentNode.origin.key,
            value: this.selectedNode.parentNode.origin.title
          }];
          this.structure.parentId = this.selectedNode.parentNode.origin.key;
        }
      } else {
        this.getManagerByKey(this.selectedNode.key);
      }
    }
    // if (this.structures[this.selectedNode.key].type === 'subdivision') {
      this.modal.open({
        body: body,
        header: null,
        footer: footer,
        options: options
      });
    // }
  }

  createSub() {
    this.isVisibleAddSubdivision = false;
    if (this.isNew && this.selectedNode.origin.key != null) {
      this.structure.parent = [{
        id: this.selectedNode.origin.key,
        value: this.selectedNode.origin.title
      }];
      this.structure.parentId = this.selectedNode.origin.key;
      this.structure.id = null;
    }
    return this.http.post<Status>(`${environment.apiUrl}/api/structure/edit`, this.structure)
        .subscribe({
          next: async data => {
            if (data.status === 1) {
              this.loaded = false;
              this.toastr.success(data.message, 'Success', {closeButton: true});
              // await this.addChildrenNode(this.nodes);
              this.nodes = await this.getStructure();
              this.loaded = true;
            } else {
              this.toastr.error(data.message, 'Error', {closeButton: true});
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  createEmployees() {
    this.isVisibleAddEmployee = false;
    return this.http.post<Status>(`${environment.apiUrl}/api/structure/edit/employee/${this.selectedNode.key}`, this.structure)
        .subscribe({
          next: async data => {
            if (data.status === 1) {
              this.loaded = false;
              this.toastr.success(data.message, 'Success', {closeButton: true});
              // await this.addChildrenNode(this.nodes);
              this.nodes = await this.getStructure();
              this.loaded = true;
            } else {
              this.toastr.error(data.message, 'Error', {closeButton: true});
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  deleteStructure() {
    this.closeModal();
    if (this.selectedNode.key === '00000000-0000-0000-0000-000000000000') {
      return;
    }
    return this.http.delete<Status>(`${environment.apiUrl}/api/structure/delete/${this.selectedNode.key}`)
        .subscribe({
          next: async data => {
            if (data.status === 1) {
              this.loaded = false;
              this.toastr.success(data.message, 'Success', {closeButton: true});
              this.nodes = await this.getStructure();
              this.loaded = true;
            } else {
              this.toastr.error(data.message, 'Error', {closeButton: true});
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  // async addChildrenNode(nodes: NzTreeNodeOptions[]) {
  //   for (const item of nodes) {
  //     if (item.key === this.selectedNode.key) {
  //       item.children = await this.getStructure();
  //       if (item.children.length) {
  //         item.isLeaf = false;
  //         item.expanded = true;
  //       }
  //       return true;
  //     }
  //     if (item.children != null && item.children.length) {
  //       if (await this.addChildrenNode(item.children)) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }
  // searchValue = '';

  closeModal() {
    this.modal.close();
  }

  // async nzEvent(event: Required<NzFormatEmitEvent>) {
  //   // load child async
  //   if (event.eventName === 'expand') {
  //     const node = event.node;
  //     if (node && node.getChildren().length === 0 && node.isExpanded) {
  //       node.addChildren(await this.getStructure(node.key, false));
  //     }
  //   }
  // }


  getIcon(type): string {
    switch (type) {
      case 'subdivision':
        return 'icofont-institution';
      case 'profile':
        return 'icofont-user';
    }
    return '';
  }

  selectingNode(node: NzTreeNodeOptions) {
    this.selectedNode = node;
  }

  getManagers(data: Structure) {
    if (data.type === 'subdivision' && data.manager.length) {
      this.managerIds.push(data.manager[0]['id']);
    } else if (data.type === 'profile') {
      const index = this.managerIds.indexOf(data.profileId);
      if (index !== -1) {
        this.managerIds[index] = data.id;
      }
    }
  }

  getManagerByKey(key: string): any {
    return this.http.get<Structure>(`${environment.apiUrl}/api/structure/get/${key}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.structures[data.id] = data;
          this.structure = data;
          this.structure.displayName = data.displayName;
          this.structure.id = data.id;
          this.structure.manager = data.manager;
          this.structure.type = data.type;
          if (this.selectedNode.parentNode) {
            this.structure.parent = [{
              id: this.selectedNode.parentNode.origin.key,
              value: this.selectedNode.parentNode.origin.title
            }];
            this.structure.parentId = this.selectedNode.parentNode.origin.key;
          }
        });
  }

  showModal(type = 'subdivision', isNew = false): void {
    if (!type.length) {
      type = 'subdivision';
    }
    this.structure.type = type;
    if (type === 'subdivision' || type === 'editprofile') {
      this.isVisibleAddSubdivision = true;
      this.structure.type = 'subdivision';
    } else if (type === 'profile') {
      this.isVisibleAddEmployee = true;
    }
    this.isNew = isNew;
    this.loaded = true;
    this.structure.parentId = this.selectedNode.key;
    if (this.isNew) {
      this.structure.displayName = '';
      this.structure.manager = [];
      this.structure.employee = [];
    } else {
      if (this.structures[this.selectedNode.key]) {
        this.structure = this.structures[this.selectedNode.key];
        if (this.selectedNode.parentNode) {
          this.structure.parent = [{
            id: this.selectedNode.parentNode.origin.key,
            value: this.selectedNode.parentNode.origin.title
          }];
          this.structure.parentId = this.selectedNode.parentNode.origin.key;
        }
      } else {
        this.getManagerByKey(this.selectedNode.key);
      }
    }
  }

  handleCancelMiddle(): void {
    this.isVisibleAddEmployee = false;
    this.isVisibleAddSubdivision = false;
  }
}
