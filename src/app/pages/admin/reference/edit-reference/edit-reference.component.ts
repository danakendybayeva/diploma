import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../../store/actions/page.actions';
import {Status} from '../../../../interfaces/services/util.service';
import {Video} from '../../../../interfaces/services/projects/courses.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IReference, ISection} from '../../../../interfaces/services/reference/reference';
import {FieldService} from '../../../../interfaces/services/reference/field.service';

@Component({
  selector: 'edit-reference',
  templateUrl: './edit-reference.component.html',
  styleUrls: ['./edit-reference.component.scss']
})
export class EditReferenceComponent extends BasePageComponent implements OnInit, OnDestroy {
  isNew = true;

  referenceId = '';
  sectionId = null;
  typeField = null;
  fieldId = null;
  fieldsTogether = [];
  valueRef: IReference = {
    id: null,
    title: '',
    hint: '',
    description: '',
    userFields: null,
    sysFields: null
  };

  fieldsData = [];
  sectionsData = [];
  _routeListener = null;
  section: ISection = {
    id: '',
    title: '',
    hint: null,
    access: [],
    fields: this.fieldsData,
    groupField: [],
    sortField: [],
    enableCustomFields: false,
    filterField: [],
    referenceId: '',
    showOrder: 99999
  };

  urlPath = '';

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private fieldService: FieldService,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'New Reference',
      loaded: true
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.initRoute().then(r => {});
    this.onRouteChange();
  }

  ngOnDestroy() {
    this._routeListener.unsubscribe();
  }

  onRouteChange() {
    this._routeListener = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initRoute().then(r => {});
      }
    });
  }

  async initRoute() {
    if (this.route.snapshot.params['typeField']) {
      this.typeField = this.route.snapshot.params['typeField'];
    }
    if (this.route.snapshot.params['fieldId']) {
      this.fieldId = this.route.snapshot.params['fieldId'];
    }
    this.urlPath = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;

    if (this.route.snapshot.params['referenceId']) {
      this.referenceId = this.route.snapshot.params['referenceId'];
      this.isNew = false;
      this.valueRef = await this.fieldService.getReferenceById(this.referenceId);
      this.fieldsData = this.fieldService.getFieldsDataSB(this.valueRef.userFields, this.valueRef.sysFields);
      this.sectionsData = await this.fieldService.getReferenceSections(this.referenceId);
      this.fieldsTogether = this.fieldService.getAllFieldsByObject(this.valueRef.userFields, this.valueRef.sysFields);
      this.section.referenceId = this.referenceId;
      this.pageData = {
        title: 'Свойства справочника',
        loaded: true
      };

      if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'section') {
        this.sectionId = this.urlPath;
        this.typeField = 'section';
      }

      super.ngOnInit();
    }

  }

  submitEvent(result: Status) {
    if (result.status === 1) {
      this.toastr.success(result.message, 'Success', { closeButton: true });
      this.router.navigate([result.value]).then(r => {});
    } else {
      this.toastr.error(result.message, 'Error', { closeButton: true });
    }
  }

  getById(data: any[], key: string) {
    const index = key ? data.findIndex(obj => obj.id === key) : -1;
    if (index >= 0) {
      return data[index];
    }
    return null;
  }

}
