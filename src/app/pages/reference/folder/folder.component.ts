import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../base-page';
import { HttpService } from '../../../services/http/http.service';
import {IAppState} from '../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../store/actions/page.actions';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IPageContent} from '../../../interfaces/services/page/page-content';
import {FieldService} from '../../../interfaces/services/reference/field.service';
import {Status, Util} from '../../../interfaces/services/util.service';
import {IReference} from '../../../interfaces/services/reference/reference';
import {TCModalService} from '../../../ui/services/modal/modal.service';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd';
import {IOption} from '../../../ui/interfaces/option';

const KBFALLCOLUMNSECTIONID = '0e3e00bd-5a5a-4f36-8532-ca412e1cf4d6';
const INVITEMESSAGE: IOption[] = [
  {
    label: 'Құттықтаймыз сіз 2-ші турға өттіңіз! Келесі турға құжаттар тапсыру үшін төмендегі сілтемеге өтіңіз',
    value: 'Құттықтаймыз сіз 2-ші турға өттіңіз! Келесі турға құжаттар тапсыру үшін төмендегі сілтемеге өтіңіз'
  },
  {
    label: 'Құттықтаймыз сіз 3-ші турға өттіңіз! Келесі тур сұхбаттасу арқылы өтеді.',
    value: 'Құттықтаймыз сіз 3-ші турға өттіңіз! Келесі тур сұхбаттасу арқылы өтеді.'
  },
  {
    label: 'Құттықтаймыз сіз стипендиат атандыңыз!',
    value: 'Құттықтаймыз сіз стипендиат атандыңыз!'
  },
  {
    label: 'Құттықтаймыз сіз мүмкіндіктер статусына өттіңіз!',
    value: 'Құттықтаймыз сіз мүмкіндіктер статусына өттіңіз!'
  }
];
const REFUSEMESSAGE: IOption[] = [
  {
    label: 'Құрметті үміткер біз сіз туралы ақпаратпен толық таныстық, бірақ өкінішке орай сізді келесі кезеңге өткізе алмайтындығымызды хабарлаймыз. Алдағы уақытта сәттілік тілейміз!',
    value: 'Құрметті үміткер біз сіз туралы ақпаратпен толық таныстық, бірақ өкінішке орай сізді келесі кезеңге өткізе алмайтындығымызды хабарлаймыз. Алдағы уақытта сәттілік тілейміз!'
  }
];
@Component({
  selector: 'tc-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class TCFolderComponent extends BasePageComponent implements OnInit, OnDestroy {
  referenceId = '';
  sectionId = '';

  color = '';
  fontColor = '#000000';

  pageSize = 30;
  pageIndex = 1;
  totalData = -1;
  loading = false;
  loadingDownload = false;
  totalPages = 0;
  isLast = false;
  fixPage = true;

  dataRecord: any[] = [];
  headerRecord: any[] = [];
  checkData = [];
  hasCheck = false;
  fastEditEnable = true;

  loadingAuto = false;
  routeSnapshot = '';
  queryParams: any = {};
  isEmpty = false;
  enableCustomFields = false;


  filterVar = {};
  onFilter = false;
  _routeListener = null;
  editIndex = -1;
  labelForm: FormGroup;
  fieldsValue = {};
  enableFilter = true;
  enableSearch = true;
  searchValue = '';
  canAdd = false;


  sortData = {};
  clickMenu = [];
  studentList = false;
  isKBFTur = false;
  studentsSelection = [];
  emailMessage = '';
  addRecord = 'Add Record';
  addButtons = [];
  pageSizeOption = [
    {value: 20, label: '20'},
    {value: 30, label: '30'},
    {value: 40, label: '40'},
    {value: 50, label: '50'},
    {value: 100, label: '100'},
    {value: 1000000, label: 'All'},
  ];

  genderBorderRadius = '25px';
  genderPadding = '7px';
  inviteMessage: IOption[] = [];
  refuseMessage: IOption[] = [];
  selectedMessage = '';
  kbfStudentStatus = {};
  isAllChecked: Boolean = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              protected formBuilder: FormBuilder,
              protected http: HttpClient, protected router: Router,
              protected route: ActivatedRoute,
              protected toastr: ToastrService,
              protected fieldService: FieldService,
              protected modal: TCModalService,
              private nzContextMenuService: NzContextMenuService,
  ) {
    super(store, httpSv);
    if (this.pageData == null) {
      this.pageData = {
        title: 'Reference List',
        loaded: true
      };
    }
    this.inviteMessage = INVITEMESSAGE;
    this.refuseMessage = REFUSEMESSAGE;
  }

  ngOnInit() {
    super.ngOnInit();
    this.onRouteChange();
    this.initRoute();
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

  superOnInit() {
    super.ngOnInit();
  }

  onRouteChange() {
    this._routeListener = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initRoute().then();
      }
    });
  }

  initSetIds() {

  }

  async initRoute() {
    this.editIndex = -1;
    this.fieldsValue = {};
    if (
        this.route.snapshot.params['referenceId']
        && (
            this.route.snapshot.params['referenceId'] !== this.referenceId
            || (this.route.snapshot.params['sectionId'] && this.route.snapshot.params['sectionId'] !== this.sectionId)
        )
    ) {
      this.loading = true;
      this.isEmpty = false;
      this.searchValue = '';
      this.enableCustomFields = false;
      this.routeSnapshot = this.route.snapshot['_routerState'].url;
      const urlTree = this.router.parseUrl(this.routeSnapshot);
      this.routeSnapshot = urlTree.root.children['primary'].segments.map(it => it.path).join('/');

      this.referenceId = this.route.snapshot.params['referenceId'];
      this.canAdd = await this.fieldService.mayAccessRecord('add', this.referenceId);

      this.headerRecord = [];
      this.dataRecord = [];
      this.checkData = [];
      this.totalData = -1;
      this.totalPages = 0;
      this.pageIndex = 1;

      if (this.route.snapshot.params['sectionId']) {
        this.sectionId = this.route.snapshot.params['sectionId'];
        this.studentList = this.isStudentList();
        this.isKBFTur = this.checkKBFTur();
        if (this.studentList) {
          this.addRecord = 'Add Student';
        }
      }
      this.route.queryParams.subscribe(param => {
        this.queryParams = param;
        if (this.queryParams['page'] && this.queryParams['page'] > 0) {
          this.pageIndex = this.queryParams['page'];
        }
        if (this.queryParams['sort']) {
          const sortList = this.queryParams['sort'].split(',');
          sortList.forEach((obj, index) => {
            const sT = obj.split(':');
            if (sT.length > 1) {
              this.sortData[sT[0]] = {
                key: sT[0],
                value: sT[1],
                order: index
              };
            }
          });
        }
      });
      this.renderQueryParams(this.queryParams);

      this.getListRefRecord();
      // TODO dorabotat
      this.hasCheck = true;
    } else {
      if (this.pageData == null) {
        this.pageData = {
          title: 'Reference List',
          loaded: true
        };
      }
    }
    super.ngOnInit();
  }

  isStudentList(): boolean {
    return this.referenceId === '00000000-0000-0000-0000-000000000017' && this.sectionId === '00000000-0000-0000-0000-000000000001';
  }

  checkKBFTur(): boolean {
    return this.referenceId === 'ce88aa43-dd6f-495c-9a05-a2fdfcc83fc1' && this.sectionId === 'ce09f69a-34ab-4d7f-981f-915763602db7';
  }

  initTable(): void {
    setTimeout(
        () => this.store.dispatch(new PageActions.Update({ loaded: true })),
        0
    );
  }

  identify(index, item) {
    return item.name;
  }

  async getListRefRecord() {
    let url = `${environment.apiUrl}/api/reference/record/list/${this.referenceId}` +
        `?page=${this.pageIndex}&size=${this.pageSize}&customised=true`;
    if (this.sectionId) {
      if (this.isKBFTur) {
        this.pageSize = 100;
      }
      url = `${environment.apiUrl}/api/reference/section/list/${this.referenceId}/${this.sectionId}` +
          `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}&s=${this.searchValue}`;
    }
    this.loading = true;

    this.initTable();
    this.headerRecord = this.prepareCustomFilter(await this.fieldService.getHeaderFields(this.referenceId, this.sectionId));
    return this.http.get<IPageContent>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          if (data.size > 0) {
            this.dataRecord = data.content;
            this.checkData = new Array(this.dataRecord.length).fill(false);
            this.totalData = data.totalElements;
            this.totalPages = data.totalPages;
            this.isLast = data.last;
            this.loading = false;
            if (
                this.dataRecord.length
                // this.dataRecord[0]['created_at']
                && (this.dataRecord[0]['creator'] || this.dataRecord[0]['updated_at'])
            ) {
              this.enableCustomFields = true;
            }
          } else {
            this.isEmpty = true;
          }
          this.loading = false;
        });
  }

  onChangePageIndex(param) {
    this.pageIndex = param;
    this.loading = true;
    this.getListRefRecord();
    this.renderQueryParams({page: this.pageIndex});
  }

  onChangeSort(param): void {
    if (param.value) {
      this.sortData[param.key] = param;
      Object.entries(this.sortData).forEach(
          ([key, value]) => {
            if (key === param.key) {
              value['order'] = 0;
            } else {
              value['order']++;
            }
          }
      );
    } else {
      delete this.sortData[param.key];
    }
    this.renderQueryParams({sort: this.prepareSortParam()});
    this.getListRefRecord();
  }

  searchParam() {
    this.onChangePageIndex(1);
  }

  prepareSortParam(): string {
    const sort = [];
    Object.entries(this.sortData).forEach(
        ([key, value]) => {
          // sort.push([key, value['value'], value['order']].join(':'));
          sort.push(value);
        }
    );
    sort.sort((prev, curr) => curr.order < prev.order ? 1 : -1);
    const sortParam = [];
    sort.forEach(value => {
      sortParam.push([value['key'], value['value']].join(':'));
    });
    return sortParam.join(',');
  }

  changeDefaultAuto(index) {
    const wordSearch = this.headerRecord[index]['filterValue'];
    if (this.headerRecord[index]['filterValue'].length > 2) {
      this.loadingAuto = true;
    }
    setTimeout(() => {
      if (wordSearch === this.headerRecord[index]['filterValue']) {
        if (this.headerRecord[index]['filterValue'] && this.headerRecord[index]['filterValue'].length > 2) {
          this.getListAutocomplete(index);
        }
      }
    }, 900);
  }

  getListAutocomplete(index) {
    const fields = [this.headerRecord[index].id];
    const templateView = '{' + this.headerRecord[index].title + '}';
    return this.http.get<any[]>(`${environment.apiUrl}/api/reference/section/get/autocomplete/${this.referenceId}/${this.sectionId}` +
        `?value=${encodeURI(this.headerRecord[index]['filterValue'])}&fields=${encodeURI(fields.join(','))}&template=${encodeURI(templateView)}`, {params: this.queryParams})
        .pipe(map(data => {
          if (!this.headerRecord[index]['autoValues']) {
            this.headerRecord[index]['autoValues'] = [];
          }
          this.headerRecord[index]['autoValues'] = Util.getUnique(this.headerRecord[index]['autoValues'].concat(data), 'value');
          return data;
        }))
        .subscribe(data => {
          this.loadingAuto = false;
        });
  }

  changeDefaultAutoSelected(event) {

  }

  updateFilter(): void {
    this.pageIndex = 1;
    const fieldParam = {'page': this.pageIndex};
    this.headerRecord.forEach(item => {
      switch (item.type) {
        case 'date':
        case 'timestamp':
        case 'integer':
        case 'float':
          const range = [];
          let addParam = false;
          if (item['from'] !== null && item['from'].toString() !== '') {
            range.push((item.type === 'timestamp' || item.type === 'date') ? new Date(item['from']).getTime() : item['from'].toString());
            addParam = true;
          } else {
            range.push('');
          }
          if (item['to'] !== null && item['to'].toString() !== '') {
            range.push((item.type === 'timestamp' || item.type === 'date') ? new Date(item['to']).getTime() : item['to'].toString());
            addParam = true;
          } else {
            range.push('');
          }
          if (addParam) {
            fieldParam[item['id']] = encodeURI(range.join(','));
          }
          break;
        case 'enumeration':
          fieldParam[item['id']] = item['filterValue'] ? encodeURI(item['filterValue'].join(',')) : '';
          item['options'] = [];
          if (item.values) {
            item.values.forEach(obj => {
              let selected = false;
              if (item['filterValue'] && item['filterValue'].includes(obj.id)) {
                selected = true;
              }
              item['options'].push({value: obj.id, label: obj.value, selected: selected});
            });
          }
          break;
        case 'boolean':
          fieldParam[item['id']] = item['filterValue'] ? encodeURI(item['filterValue'].join(',')) : '';
          break;
        default:
          if (item['filterValue'] !== null && item['filterValue'].toString() !== '') {
            fieldParam[item['id']] = encodeURI(item['filterValue']);
          } else if (!item['filterValue'].trim()) {
            fieldParam[item['id']] = '';
          }
      }

    });
    this.renderQueryParams(fieldParam);
    this.getListRefRecord();
  }

  prepareCustomFilter(data: any[]): any[] {
    data.forEach(item => {
      switch (item.type) {
        case 'date':
        case 'timestamp':
        case 'integer':
        case 'float':
          item['from'] = '';
          item['to'] = '';
          if (this.queryParams[item['id']]) {
            const range = decodeURI(this.queryParams[item['id']]).split(',');
            if (range.length > 1) {
              item['from'] = (item.type === 'timestamp' || item.type === 'date') ? new Date(range[0]).getTime() : range[0];
              item['to'] = (item.type === 'timestamp' || item.type === 'date') ? new Date(range[1]).getTime() : range[1];
            }
          } else {
            item['filterValue'] = '';
          }
          break;
        case 'enumeration':
          item['options'] = [];
          if (this.queryParams[item['id']]) {
            item['filterValue'] = decodeURI(this.queryParams[item['id']]).split(',');
          } else {
            item['filterValue'] = [];
          }
          if (item.values) {
            item.values.forEach(obj => {
              let selected = false;
              if (item['filterValue'].length && item['filterValue'].includes(obj.id)) {
                selected = true;
              }
              item['options'].push({value: obj.id, label: obj.value, selected: selected});
            });
          }
          break;
        case 'boolean':
          if (this.queryParams[item['id']]) {
            const valBool = decodeURI(this.queryParams[item['id']]).split(',');
            item['filterValue'] = [(valBool[0].toString() === 'true'), (valBool[1].toString() === 'true')];
          } else {
            item['filterValue'] = [false, false];
          }
          break;
        default:
          item['autoValues'] = [];
          if (this.queryParams[item['id']]) {
            item['filterValue'] = decodeURI(this.queryParams[item['id']]);
          } else {
            item['filterValue'] = '';
          }
      }
    });
    return data;
  }

  renderQueryParams(queryParams: Params) {
    const keys = Object.keys(queryParams);
    const keys2 = Object.keys(this.queryParams);
    const param = {};
    keys2.forEach(item => {
      param[item] = this.queryParams[item];
    });

    keys.forEach(item => {
      param[item] = queryParams[item];
    });
    this.queryParams = param;
    this.router.navigate([this.routeSnapshot], {
      queryParams: this.queryParams
    }).then();
  }

  prepareParamsFields(): string {
    const keys = Object.keys(this.queryParams);
    const arr = ['page', 'sort'];
    let result = '';
    keys.forEach(item => {
      if (!arr.includes(item)) {
        result += `&${item}=${this.queryParams[item]}`;
      }
    });
    result += `&sort=${this.prepareSortParam()}`;
    return result;
  }

  prepareNavigateLink(id) {
    switch (this.referenceId) {
      case '00000000-0000-0000-0000-000000000017':
        return ['/vertical/profile', id];
      case '839a87b5-6706-4dec-99f9-ff38f4c2d63f':
        return ['/vertical/restaurant/price-template/view', id];
      case '042d69d0-5741-4f61-b5a8-1328f29d56eb':
        return ['/vertical/restaurant/order/view', id];
      default:
        return ['/vertical/reference/record/view', this.referenceId, id];
    }
  }

  prepareNavigateLinkCreate() {
    switch (this.referenceId) {
      case '839a87b5-6706-4dec-99f9-ff38f4c2d63f':
        return ['/vertical/restaurant/price-template/create'];
      case '042d69d0-5741-4f61-b5a8-1328f29d56eb':
        return ['/vertical/restaurant/order/create'];
      case '00000000-0000-0000-0000-000000000017':
        return ['/vertical/create/profile'];
      default:
        return ['/vertical/reference/record/create', this.referenceId];
    }
  }

  resetFilter() {
    this.headerRecord.forEach(item => {
      switch (item.type) {
        case 'date':
        case 'timestamp':
        case 'integer':
        case 'float':
          item['from'] = '';
          item['to'] = '';
          break;
        default:
          item['filterValue'] = '';
      }
    });
    this.queryParams = {};
    this.updateFilter();
  }

  fastAddRecord() {
    if (this.editIndex === -1) {
      this.labelForm = new FormGroup({});
      const record = {};
      this.headerRecord.forEach(item => {
        record[item.id] = item.defaultValue;
      });
      this.editIndex = 0;
      this.dataRecord = [record].concat(this.dataRecord);
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, index): void {
    this.clickMenu = [];
    this.prepareNavigateLinkMenu(this.dataRecord[index]);
    this.nzContextMenuService.create($event, menu);
  }

  prepareNavigateLinkMenu(record: any) {
    switch (this.referenceId) {
      case '00000000-0000-0000-0000-000000000017':
        this.clickMenu.push({'display_name': 'Edit page', 'route': ['/vertical/edit-account', record['id']]});
        break;
      default:
        this.clickMenu.push();
    }
  }

  closeMenu(): void {
    this.clickMenu = [];
    this.nzContextMenuService.close();
  }

  goTo(event: Event, link: string[]) {
    event.preventDefault();
    setTimeout(() => {
      this.router.navigate(link).then();
    });
  }

  prepareValues() {
    const values = {};
    this.headerRecord.forEach(item => {
      values[item.id] = item.value;
    });
    this.fieldsValue = values;
  }

  submitEvent(valid: boolean) {
    // TODO valid
    if (valid) {
      this.prepareValues();
      return this.http.post<Status>(`${environment.apiUrl}/api/reference/record/create/${this.referenceId}`, this.fieldsValue)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                this.editIndex = -1;
                this.fieldsValue = {};
                this.getListRefRecord();
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    } else {
      this.getFormValidationErrors();
    }
    this.getFormValidationErrors();
  }

  getFormValidationErrors() {
    this.labelForm.markAllAsTouched();
    Object.keys(this.labelForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.labelForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  async download() {
    this.loadingDownload = true;
    // TODO change to post
    const selectedRecords = [];
    for (let i = 0; i < this.checkData.length; i++) {
      if (this.checkData[i]) {
        if (this.dataRecord[i]['id']) {
          selectedRecords.push(this.dataRecord[i]['id']);
        }
      }
    }
    const data = {
      selectedRecords: selectedRecords,
      referenceId: this.referenceId,
      sectionId: this.sectionId
    };
    if (this.isKBFTur) {
      data.sectionId = KBFALLCOLUMNSECTIONID;
    }
    await this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/reference-list` +
        `?${this.prepareParamsFields()}&s=${this.searchValue}`, data)
        .toPromise()
        .then(resp => resp)
        .catch();
    await this.http.get(`${environment.apiUrl}/api/media/file/excel/download`,
        {responseType: 'blob' as 'json'}).subscribe(
        (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          downloadLink.setAttribute('download', `List_of_students.xlsx`);
          document.body.appendChild(downloadLink);
          downloadLink.click();
        }
    );
    this.loadingDownload = false;
    return this.http.post<any[]>(`${environment.apiUrl}/api/media/file/excel/delete`, 'temp.xlsx')
        .subscribe(
            res => {},
            err => {
              this.toastr.error(err, 'Error', { closeButton: true });
            }
        );
  }

  remove(id: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${id}`, {})
        .toPromise()
        .then()
        .catch();
  }

  setColor(type: string) {
    if (type == 'Женский') {
      this.setFontColor();
      return this.color = '#f92fa1';
    } else if (type == 'Мужской') {
      this.setFontColor();
      return this.color = '#55AAFF';
    }
  }

  setFontColor() {
    return this.fontColor = '#FFFFFF';
  }

  closeModal() {
    this.modal.close();
  }

  openModal(
      body: any,
      header: any = null,
      footer: any = null,
      options: any = null
  ) {
    this.studentsSelection = [];
    // tslint:disable-next-line:no-shadowed-variable
    this.dataRecord.forEach((value, index) => {
      if (this.checkData[index]) {
        const student = {
          firstname: value['firstname'],
          secondname: value['secondname'],
          lastname: value['lastname'],
          email: value['email'],
          id: value['id']
        };
        this.studentsSelection.push(student);
      }
    });
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  async sendInvatationMessage() {
    const data = {
      studentsData: this.studentsSelection,
      message: this.emailMessage
    };
    this.closeModal();

    if (this.selectedMessage.includes('Құттықтаймыз сіз 2-ші турға өттіңіз!')) {
      await this.http.post<Status>(`${environment.apiUrl}/api/mail/inviteMessage`, data)
          .subscribe({
            // tslint:disable-next-line:no-shadowed-variable
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                // this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value]).then(r => {});
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
              }
            },
            error: err => {
              this.toastr.error('Not sended!', 'Error', { closeButton: true });
            }
          });
    } else {
      await this.http.post<Status>(`${environment.apiUrl}/api/mail/sendMessage`, data)
          .subscribe({
            // tslint:disable-next-line:no-shadowed-variable
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                // this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value]).then(r => {});
              } else {
                this.toastr.error(data.message, 'Error', { closeButton: true });
              }
            },
            error: err => {
              this.toastr.error('Not sended!', 'Error', { closeButton: true });
            }
          });
    }

    return this.updateStudentStatus();
  }

  async sendRefuseMessage() {
    const data = {
      studentsData: this.studentsSelection,
      message: this.emailMessage
    };
    this.closeModal();
    await this.http.post<Status>(`${environment.apiUrl}/api/mail/sendMessage`, data)
        .subscribe({
          // tslint:disable-next-line:no-shadowed-variable
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              // this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value]).then(r => {});
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: err => {
            this.toastr.error('Not sended!', 'Error', { closeButton: true });
          }
        });
    return this.updateStudentStatus(true);
  }

  async updateStudentStatus(isRefuseMessage: boolean = false) {
    const recordIds = [];
    this.studentsSelection.forEach( (value) => {
      recordIds.push(value['id']);
    });
    const payload = {
      ids: recordIds,
      record: this.kbfStudentStatus
    };
    this.http.post<Status>(`${environment.apiUrl}/api/reference/record/edit/list/${this.referenceId}`, payload)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              // this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value]).then(r => {});
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
    // this.studentsSelection.forEach(value => {
    //   console.log(value);
    //   this.http.post<Status>(`${environment.apiUrl}/api/reference/record/edit/${this.referenceId}/${value['id']}`, this.kbfStudentStatus)
    //       .subscribe({
    //         next: data => {
    //           if (data.status === 1) {
    //             this.toastr.success(data.message, 'Success', { closeButton: true });
    //             // this.router.navigate(['/vertical/reference/record/view', this.referenceId, data.value]).then(r => {});
    //           } else {
    //             this.toastr.error(data.message, 'Error', { closeButton: true });
    //           }
    //         },
    //         error: error => {
    //           this.toastr.error('Not saved!', 'Error', { closeButton: true });
    //         }
    //       });
    // });
    return this.getListRefRecord();
  }

  changeValueEnum() {
    this.emailMessage = this.selectedMessage;
    if (this.selectedMessage === 'Құттықтаймыз сіз 2-ші турға өттіңіз! Келесі турға құжаттар тапсыру үшін төмендегі сілтемеге өтіңіз') {
      this.kbfStudentStatus = { status: [{ id: '2', value: '2 тур' }]};
    } else if (this.selectedMessage === 'Құттықтаймыз сіз 3-ші турға өттіңіз! Келесі тур сұхбаттасу арқылы өтеді.') {
      this.kbfStudentStatus = { status: [{ id: '3', value: '3 тур' }]};
    } else if (this.selectedMessage === 'Құттықтаймыз сіз стипендиат атандыңыз!') {
      this.kbfStudentStatus = { status: [{ id: '4', value: 'Стипендия' }]};
    } else if (this.selectedMessage === 'Құттықтаймыз сіз мүмкіндіктер статусына өттіңіз!') {
      this.kbfStudentStatus = { status: [{ id: '5', value: 'Мүмкіндік' }]};
    } else if (this.selectedMessage === 'Құрметті үміткер біз сіз туралы ақпаратпен толық таныстық, бірақ өкінішке орай сізді келесі кезеңге өткізе алмайтындығымызды хабарлаймыз. Алдағы уақытта сәттілік тілейміз!') {
      this.kbfStudentStatus = { status: [{ id: '6', value: 'Қабылданбады' }]};
    }
  }

  delete() {
    this.studentsSelection.forEach(it => {
      this.http.post<Status>(`${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${it['id']}`, {})
          .subscribe(
              {
                // tslint:disable-next-line:no-shadowed-variable
                next: data => {
                  if (data.status === 1) {
                    this.toastr.success(data.message, 'Records removed', { closeButton: true });
                  } else {
                    this.toastr.error(data.message, 'Error', { closeButton: true });
                  }
                },
                error: error => {
                  this.toastr.error('', 'Error', { closeButton: true });
                }
              }
          );
    });
    this.getListRefRecord();
    this.closeModal();
  }

  checkAllRecord() {
    if (!this.isAllChecked) {
      for (let i = 0; i <= 99; i++) {
        this.checkData[i] = true;
      }
    } else {
      this.checkData = [];
    }
    this.isAllChecked = !this.isAllChecked;
  }
}
