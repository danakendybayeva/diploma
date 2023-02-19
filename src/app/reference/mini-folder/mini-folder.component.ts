import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../pages/base-page';
import { HttpService } from '../../services/http/http.service';
import {IAppState} from '../../interfaces/app-state';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import * as PageActions from '../../store/actions/page.actions';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {IPageContent} from '../../interfaces/services/page/page-content';
import {Structure} from '../../interfaces/services/structure.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {ReferenceField} from '../../interfaces/services/reference/fields/reference';

@Component({
  selector: 'tc-mini-folder-ref',
  templateUrl: './mini-folder.component.html',
  styleUrls: ['./mini-folder.component.scss']
})
export class TCMiniFolderRefComponent extends BasePageComponent implements OnInit, OnChanges {
  data: any[];
  @Input() referenceTitle = '';
  // TODO Sort field
  @Input() sortField = [];
  @Input() records = [];
  @Input() isStructure = false;
  @Input() params = false;
  @Input() reference: ReferenceField = null;
  @Output() public selectedItem: EventEmitter<any[]> = new EventEmitter();
  selectedItems = [];
  selectedIds = [];

  searchValue = '';
  pageSize = 20;
  pageIndex = 1;
  loading = false;
  totalData = 0;
  totalPages = 0;
  selItem = [];

  headerRecord: any = {};
  checkData = [];
  hasCheck = false;

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
  loadedStructure = false;
  nodes: NzTreeNodeOptions[] = [];
  structures = {};
  managerIds = [];
  activedNode: NzTreeNode;

  pageIndexRoles = 1;
  loadingRoles = false;
  roles: any[];
  totalDataRoles = 0;
  totalPagesRoles = 0;
  headerRoles: any = {};
  checkDataRoles = [];

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute
  ) {
    super(store, httpSv);
    this.data = [];
    this.pageData = {
      title: '',
      loaded: true
    };
    this.loading = true;
  }

  ngOnInit() {
    super.ngOnInit();
    // TODO потом озгерту керек; когда екі модалка ашылганда search input жасамайды; пока говно код спасает
    const myElement = document.getElementsByClassName('cdk-overlay-container');
    for (let i = 0; i < myElement.length; i++) {
      const slide = myElement[i] as HTMLElement;
      slide.style.display = 'none';
    }
  }

  async ngOnChanges(changes) {
    if (changes.records && this.records) {
      const sIds = [];
      this.selectedItems = this.records;
      this.records.forEach(obj => {
        sIds.push(obj.id);
      });
      this.selectedIds = sIds;
    }
    if (changes.reference && this.reference) {
      if (this.isStructure) {
        // TODO Structure must fix
        this.getRoleRefRecord();
        this.nodes = await this.getStructure();
        this.loadedStructure = true;
        this.reference.referenceId = '00000000-0000-0000-0000-000000000017';
      }
      this.getSelectedRecord();
      this.getListRefRecord();
      this.hasCheck = true;
    }
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  getListRefRecord() {
    this.initTable();
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/reference/record/list/${this.reference.referenceId}` +
        `?page=${this.pageIndex}&size=${this.pageSize}&customised=false&fields=${this.reference.fields.join(',')}` +
        `&sids=${this.selectedIds.join(',')}&headerenable=true&s=${this.searchValue}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0) {
            this.headerRecord = data.content[0];
            this.data = data.content.splice(1);
            this.checkData = new Array(this.data.length).fill(false);
            this.data.forEach((item, key) => {
              if (this.selectedIds.includes(item.id)) {
                this.checkData[key] = true;
                this.updateInfoSelected(item);
              }
            });
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
          }
          this.loading = false;
        });
  }

  getSelectedRecord() {
    this.initTable();
    return this.http.get<any[]>(`${environment.apiUrl}/api/reference/record/get/selected/${this.reference.referenceId}` +
        `?fields=${this.reference.fields.join(',')}&rec=${this.selectedIds.join(',')}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          const result = [];
          this.selectedItems.forEach(obj => {
            const findIndex = data.findIndex(function (o) {
              return o.id === obj.id;
            });
            // TODO Structure must fix
            if (findIndex >= 0) {
              result.push(data[findIndex]);
            } else if (this.isStructure) {
              let valp = '';
              if (obj.value) {
                valp = obj.value;
              } else if (obj.fio) {
                valp = obj.fio;
              }
              result.push({id: obj.id, fio: valp});
            }
          });
          this.selectedItems = result;
          this.selectedItem.emit(this.selectedItems);
        });
  }

  updateInfoSelected(item: any) {
    // this.selectedItems.push(item);
  }

  onChangePageIndex(param) {
    this.loading = true;
    this.pageIndex = param;
    this.getListRefRecord();
  }

  searchParam() {
    this.loading = true;
    this.pageIndex = 1;
    this.getListRefRecord();
  }

  onChangeSort(param): void {
    console.log(param);
  }

  selectSpan(index: number) {
    // this.checkData[index] = !this.checkData[index];
    this.changeCheckbox(index);
  }

  changeCheckbox(index: number, isSpan = false) {
    if (isSpan) {
      this.checkData[index] = !this.checkData[index];
    }
    if (this.checkData[index]) {
      if (this.reference.isSingle) {
        for (let i = 0; i < this.checkData.length; i++) {
          this.checkData[i] = false;
        }
        this.selectedItems = [this.data[index]];
        this.selectedIds = [this.data[index].id];
        this.checkData[index] = true;
      } else {
        if (this.selectedIds.length >= this.reference.limit  && this.reference.limit >= 0) {
          this.checkData[index] = false;
          return;
        }
        if (!this.selectedIds.includes(this.data[index].id)) {
          this.selectedItems.push(this.data[index]);
          this.selectedIds.push(this.data[index].id);
        }
      }
    } else {
      if (this.reference.isSingle) {
        this.selectedItems = [];
        this.selectedIds = [];
        for (let i = 0; i < this.checkData.length; i++) {
          this.checkData[i] = false;
        }
      } else {
        const data = this.data;
        const findIndex = this.selectedItems.findIndex(function (o) {
          return o.id === data[index].id;
        });
        if (findIndex !== -1 ) {
          this.selectedItems.splice(findIndex, 1);
        }
        const indexIds = this.selectedIds.indexOf(this.data[index].id);
        if (indexIds > -1) {
          this.selectedIds.splice(indexIds, 1);
        }
      }
    }
    this.selectedItem.emit(this.selectedItems);
  }

  async nzEventStructure(event) {
    // load child async
    if (event.eventName === 'expand') {}
  }

// TODO Structure must fix
  nzCheckChange(event) {
    if (event.node.origin.checked) {
      if (this.reference.isSingle) {
        this.selectedItems = [{id: event.node.origin.key, fio: event.node.origin.title}];
        this.selectedIds = [event.node.origin.key];
      } else {
        if (this.selectedIds.length >= this.reference.limit  && this.reference.limit >= 0) {
          event.node.origin.checked = false;
          return;
        }
        if (!this.selectedIds.includes(event.node.origin.key)) {
          this.selectedItems.push({id: event.node.origin.key, fio: event.node.origin.title});
          this.selectedIds.push(event.node.origin.key);
        }
      }
    } else {
      if (this.reference.isSingle) {
        this.selectedItems = [];
        this.selectedIds = [];
      } else {
        const findIndex = this.selectedItems.findIndex(function (o) {
          return o.id === event.node.origin.key;
        });
        if (findIndex !== -1 ) {
          this.selectedItems.splice(findIndex, 1);
        }
        const indexIds = this.selectedIds.indexOf(event.node.origin.key);
        if (indexIds > -1) {
          this.selectedIds.splice(indexIds, 1);
        }
      }
    }
    this.selectedItem.emit(this.selectedItems);
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
      const findIndex = this.selectedIds.findIndex(function (o) {
        return o === item.id;
      });
      nodes.push({
        title: item.displayName,
        key: item.id,
        expanded: expanded,
        icon: '',
        checked: (findIndex >= 0)
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

  async onChangeIndexTab(index) {
    // if (index === 1) {
    //   this.nodes = await this.getStructure();
    //   // await this.getStructureAll();
    //   this.loadedStructure = true;
    // }
  }


  // roles
  // TODO Structure must fix
  getRoleRefRecord() {
    this.initTable();
    return this.http.get<IPageContent>(`${environment.apiUrl}/api/reference/record/list/00000000-0000-0000-0000-000000000019` +
        `?page=${this.pageIndexRoles}&size=${this.pageSize}&customised=false&fields=display_name&sids=${this.selectedIds.join(',')}&headerenable=true`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0) {
            this.headerRoles = data.content[0];
            this.headerRoles.header.forEach((item, key) => {
              if (item.id === 'display_name') {
                this.headerRoles.header[key].id = 'fio';
              }
            });
            this.roles = [{
              id: '00000000-0000-0000-0000-000000000000',
              display_name: 'Все пользователи'
            }];
            this.roles = this.roles.concat(data.content.splice(1));
            this.checkDataRoles = new Array(this.data.length).fill(false);
            this.roles.forEach((item, key) => {
              if (this.selectedIds.includes(item.id)) {
                this.checkDataRoles[key] = true;
                this.updateInfoSelected(item);
              }
              this.roles[key]['fio'] = this.roles[key]['display_name'];
              delete this.roles[key]['display_name'];
            });
            this.totalDataRoles = data.totalElements;
            this.totalPagesRoles = data.totalPages;
          }
          this.loadingRoles = false;
        });
  }


  changeCheckboxRoles(index: number, isSpan = false) {
    if (isSpan) {
      this.checkDataRoles[index] = !this.checkDataRoles[index];
    }
    if (this.checkDataRoles[index]) {
      if (this.reference.isSingle) {
        for (let i = 0; i < this.checkDataRoles.length; i++) {
          this.checkDataRoles[i] = false;
        }
        this.selectedItems = [this.roles[index]];
        this.selectedIds = [this.roles[index].id];
        this.checkDataRoles[index] = true;
      } else {
        if (this.selectedIds.length >= this.reference.limit  && this.reference.limit >= 0) {
          this.checkDataRoles[index] = false;
          return;
        }
        if (!this.selectedIds.includes(this.roles[index].id)) {
          this.selectedItems.push(this.roles[index]);
          this.selectedIds.push(this.roles[index].id);
        }
      }
    } else {
      if (this.reference.isSingle) {
        this.selectedItems = [];
        this.selectedIds = [];
        for (let i = 0; i < this.checkDataRoles.length; i++) {
          this.checkDataRoles[i] = false;
        }
      } else {
        const data = this.roles;
        const findIndex = this.selectedItems.findIndex(function (o) {
          return o.id === data[index].id;
        });
        if (findIndex !== -1 ) {
          this.selectedItems.splice(findIndex, 1);
        }
        const indexIds = this.selectedIds.indexOf(this.roles[index].id);
        if (indexIds > -1) {
          this.selectedIds.splice(indexIds, 1);
        }
      }
    }
    this.selectedItem.emit(this.selectedItems);
  }

}
