import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Content} from '../../../../ui/interfaces/modal';
import { ToastrService } from 'ngx-toastr';
import {Status} from '../../../../interfaces/services/util.service';
import {DomSanitizer} from '@angular/platform-browser';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {Question} from '../../../../interfaces/services/projects/reads.service';
import {VariantTest} from '../../../../interfaces/services/quiz/test';
import {VariantOrder} from '../../../../interfaces/services/quiz/order-quiz';
import {VariantMatch} from '../../../../interfaces/services/quiz/match-quiz';
import {VariantFIB} from '../../../../interfaces/services/quiz/fib-quiz';
import * as PageActions from '../../../../store/actions/page.actions';

@Component({
  selector: 'read-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent extends BasePageComponent implements OnInit {
  // @Input() data: Topic[] = [];

  succesCode = '';
  errorCode = '';

  variantsTest: VariantTest[] = [
    {
      id: '',
      text: '',
      textRu: '',
      textEn: '',
      isAnswer: false
    }
  ];
  variantOrder: VariantOrder[] = [
    {
      id: '',
      text: '',
      textRu: '',
      textEn: ''
    }
  ];
  variantMatch: VariantMatch[] = [
    {
      id: '',
      text: '',
      textRu: '',
      textEn: '',
      textRel: '',
      textRuRel: '',
      textEnRel: '',
      relatedId: ''
    }
  ];
  variantFIB: VariantFIB[] = [
    {
      id: '',
      text: '',
      textRu: '',
      textEn: '',
    }
  ];
  exercise: Question = {
    id: null,
    description: '',
    descriptionRu: '',
    descriptionEn: '',
    type: 1,
    bookId: '',
    variantTest: this.variantsTest,
    variantOrder: this.variantOrder,
    variantMatch: this.variantMatch,
    variantFIB: this.variantFIB
  };

  langType = 'kz';

  apiUrl = '';
  problemId = '';
  children = false;
  tinyMceSettings = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'link lists',
    skin: 'CUSTOM',
    content_css: 'CUSTOM',
    mode : 'none',
    statusbar : false,
    toolbar: 'formatselect | bold italic underline | bullist numlist | undo redo ',
  };
  showTxt = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient, private router: Router,
              private route: ActivatedRoute,
              private modal: TCModalService,
              private sanitizer: DomSanitizer,
              private toastr: ToastrService) {
    super(store, httpSv);
    this.pageData = {
      title: 'New Problem',
      loaded: true
    };

    this.succesCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initRoute();
    setTimeout(() => {
      this.showTxt = true;
    }, 500);
  }

  initRoute() {
    if (this.route.snapshot.params['bookId']) {
      this.exercise.bookId = this.route.snapshot.params['bookId'];
    }
    if (this.route.snapshot.params['id']) {
      this.exercise.id = this.route.snapshot.params['id'];
      this.getData();
    }
  }

  getData() {
    return this.http.get<Question>(`${environment.apiUrl}/api/project/reads/quiz/get/${this.exercise.id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.exercise = data;
          this.stringToObject(data);

          if (this.route.snapshot.params['copied']) {
            this.exercise.id = null;
          }
        });
  }

  saveExercise() {
    let sUrl = `${environment.apiUrl}/api/project/reads/quiz/new`;
    if (this.exercise.id) {
      sUrl = `${environment.apiUrl}/api/project/reads/quiz/update`;
    }
    switch (this.exercise.type) {
      case 1:
      case 2:
        this.exercise.variants = JSON.stringify(this.exercise.variantTest);
        break;
      case 3:
        this.exercise.variants = JSON.stringify(this.exercise.variantFIB);
        break;
      case 4:
        this.exercise.variants = JSON.stringify(this.exercise.variantMatch);
        break;
      case 5:
        this.exercise.variants = JSON.stringify(this.exercise.variantOrder);
        break;
      default:
    }

    return this.http.post<Status>(sUrl, this.exercise)
      .subscribe({
        next: data => {
          if (data.status === 1) {
            this.toastr.success('Saved!', 'Success', { closeButton: true });
            // this.router.navigate(['/vertical/community/admin/problem/edit/', this.problemId]).then(r => {});
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }
        },
        error: error => {
          this.toastr.error('Not saved!', 'Error', { closeButton: true });
        }
      });
  }

  stringToObject(data: Question) {
    switch (this.exercise.type) {
      case 1:
      case 2:
        this.exercise.variantTest = JSON.parse(data.variants.toString());
        break;
      case 3:
        this.exercise.variantFIB = JSON.parse(data.variants.toString());
        break;
      case 4:
        this.exercise.variantMatch = JSON.parse(data.variants.toString());
        break;
      case 5:
        this.exercise.variantOrder = JSON.parse(data.variants.toString());
        break;
      default:
    }
  }

  addVariant(type) {
    switch (type) {
      case 1:
      case 2:
        this.exercise.variantTest.push({
          id: '',
          text: '',
          textRu: '',
          textEn: '',
          isAnswer: false
        });
        break;
      case 3:
        this.exercise.variantFIB.push({
          id: '',
          text: '',
          textRu: '',
          textEn: ''
        });
        break;
      case 4:
        this.exercise.variantMatch.push({
          id: '',
          text: '',
          textRu: '',
          textEn: '',
          textRel: '',
          textEnRel: '',
          textRuRel: '',
          relatedId: ''
        });
        break;
      case 5:
        this.exercise.variantOrder.push({
          id: '',
          text: '',
          textRu: '',
          textEn: '',
        });
        break;
      default:
    }

  }

  copyProblem() {
    this.toastr.success('Copied!', 'Success', { closeButton: true });
    this.router.navigate(['/vertical/reads/admin/quiz/edit/', this.exercise.id, 'copy']).then(r => {});
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  selectTypeExercise(sType) {
    this.exercise.type = sType;
  }

  nzTabIndexChange(params) {
    switch (params) {
      case 0:
        this.langType = 'kz';
        break;
      case 1:
        this.langType = 'en';
        break;
      case 2:
        this.langType = 'ru';
        break;
    }
  }

  removeVariant(item, type) {
    switch (type) {
      case 1:
      case 2:
        this.exercise.variantTest.splice(item, 1);
        break;
      case 3:
        this.exercise.variantFIB.splice(item, 1);
        break;
      case 4:
        this.exercise.variantMatch.splice(item, 1);
        break;
      case 5:
        this.exercise.variantOrder.splice(item, 1);
        break;
      default:
    }
  }

  onDrop(event) {
    moveItemInArray(this.exercise.variantOrder, event.previousIndex, event.currentIndex);
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
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

  duplicateText() {
    this.exercise.descriptionEn = this.exercise.description;
    this.exercise.descriptionRu = this.exercise.description;
    switch (this.exercise.type) {
      case 1:
      case 2:
        this.exercise.variantTest.forEach(obj => {
          obj.textEn = obj.text;
          obj.textRu = obj.text;
        });
        break;
      case 3:
        this.exercise.variantFIB.forEach(obj => {
          obj.textEn = obj.text;
          obj.textRu = obj.text;
        });
        break;
      case 4:
        this.exercise.variantMatch.forEach(obj => {
          obj.textEn = obj.text;
          obj.textRu = obj.text;
        });
        break;
      case 5:
        this.exercise.variantOrder.forEach(obj => {
          obj.textEn = obj.text;
          obj.textRu = obj.text;
        });
        break;
      default:
    }
    this.toastr.success('Duplicated!', 'Success', { closeButton: true });
  }

  variantCheckbox(event, index) {
    if (this.exercise.type === 1 || this.exercise.type === 2) {
      this.exercise.variantTest[0].isAnswer = event;
      console.log(this.exercise.variantTest);
    }
  }
}
