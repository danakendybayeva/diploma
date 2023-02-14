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
import {VariantTest} from '../../../../interfaces/services/quiz/test';
import {VariantOrder} from '../../../../interfaces/services/quiz/order-quiz';
import {VariantMatch} from '../../../../interfaces/services/quiz/match-quiz';
import {VariantFIB} from '../../../../interfaces/services/quiz/fib-quiz';
import * as PageActions from '../../../../store/actions/page.actions';
import {GenerateQuiz, Questions, Topic} from '../../../../interfaces/services/projects/community.service';
import {VariableGN} from '../../../../interfaces/services/quiz/generate-quiz';

@Component({
  selector: 'add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.scss']
})
export class AddProblemComponent extends BasePageComponent implements OnInit {
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
  variableGN: VariableGN[] = [
    {
      id: '',
      name: '',
      type: '',
      delimiter: 0,
      condition: '',
      range: [0, 0],
      variantsSolve: [],
      isAssign: false,
      assignText: ''
    }
  ];
  exercise: Questions = {
    id: null,
    description: '',
    descriptionRu: '',
    descriptionEn: '',
    type: 1,
    topicId: '',
    relativeTopics: [],
    variantTest: this.variantsTest,
    variantOrder: this.variantOrder,
    variantMatch: this.variantMatch,
    variantFIB: this.variantFIB,
    variableGN: this.variableGN
  };
  typeVariable = [
    {
      label: 'Integer',
      value: 'int'
    },
    {
      label: 'Float',
      value: 'float'
    }
  ];
  generateTest = {
    condition: '',
    description: '',
    descriptionEn: '',
    descriptionRu: '',
    solve: '',
    answerType: 'variant',
    result: this.variableGN[0],
    variable: []
  };

  langType = 'kz';

  apiUrl = '';
  problemId = '';
  topicList: Topic[] = [];
  relatedTopics = [];
  children = false;
  tinyMceSettings = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'link lists',
    skin: 'CUSTOM',
    content_css: 'CUSTOM',
    mode : 'none',
    statusbar : false,
    toolbar: 'formatselect | bold italic underline | bullist numlist | undo redo',
  };
  showTxt = false;

  generatedTest: GenerateQuiz = {
      answerVariants: [],
      description: '',
      descriptionRu: '',
      descriptionEn: '',
      answerType: ''
  };

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
    this.openTopicList();
    this.initRoute();
    setTimeout(() => {
      this.showTxt = true;
    }, 500);
  }

  initRoute() {
    if (this.route.snapshot.params['problemId']) {
      this.exercise.id = this.route.snapshot.params['problemId'];
      this.getData();
    }
  }

  getData() {
    return this.http.get<Questions>(`${environment.apiUrl}/api/project/community/questions/get/${this.exercise.id}`)
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
    let sUrl = `${environment.apiUrl}/api/project/community/questions/create/not-generated`;
    if (this.exercise.id) {
      sUrl = `${environment.apiUrl}/api/project/community/questions/create/not-generated`;
    }
    const payload = this.exercise;
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
      case 7:
        this.generateTest.variable = this.exercise.variableGN;
        this.generateTest.result = this.exercise.variableGN[0];
        this.exercise.variants = JSON.stringify([this.generateTest]);
        break;
      default:
    }

    return this.http.post<Status>(sUrl, this.exercise)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              // this.router.navigate(['/vertical/community/admin/problem/edit/', this.problemId]).then(r => {});
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  stringToObject(data: Questions) {
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
        case 7:
            const variable = JSON.parse(data.variants.toString());
            if (variable && variable.length) {
                this.exercise.variableGN = variable[0].variable;
                this.generateTest = variable[0];
            }
            break;
        default:
    }
  }

  prepareGenerate() {
    this.generateTest.variable = this.exercise.variableGN;
    this.generateTest.description = this.exercise.description;
    this.generateTest.descriptionRu = this.exercise.descriptionRu;
    this.generateTest.descriptionEn = this.exercise.descriptionEn;
    this.generateTest.result = this.exercise.variableGN[0];
    this.generatedTest = {
      answerVariants: [],
      description: '',
      descriptionRu: '',
      descriptionEn: '',
      answerType: ''
    };
    return this.http.post<Status>(`${environment.apiUrl}/api/project/community/questions/generate`, this.generateTest)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.toastr.success(data.message, 'Success', { closeButton: true });
              this.generatedTest = data.value;
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error(error, 'Error', { closeButton: true });
          }
        });
  }

  addVariant(type, isAssign = false) {
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
      case 7:
        this.exercise.variableGN.push({
          id: '',
          name: '',
          type: '',
          delimiter: 0,
          condition: '',
          range: [0, 0],
          variantsSolve: [],
          isAssign: isAssign,
          assignText: ''
        });
        break;
      default:
    }

  }

  addVariantSolves() {
    if (this.exercise.type === 7) {
      this.exercise.variableGN[0].variantsSolve.push('');
    }
  }

  openTopicList() {
    if (!this.children) {
      return this.http.get<Topic[]>(`${environment.apiUrl}/api/project/community/topic/list`)
          .pipe(map(data => {
            return data;
          }))
          .subscribe(data => {
            this.topicList = data;
            if (this.topicList.length === 0) {
              this.topicList.push({ id: '', title: '', key: '', children: [], parentId: null, orderNum: 0, hidden: false});
            } else {
              for (let i = 0; i < this.topicList.length; i++) {
                this.topicList[i].children = [];
                this.topicList[i].hidden = true;
                this.topicList[i].key = this.topicList[i].id;
              }
            }
            this.childrenData();
          });
    }
  }

  childrenData() {
    for (let i = 0; i < this.topicList.length; i++) {
      if (this.topicList[i].parentId == null || this.topicList[i].parentId === '') { continue; }
      const itemIndex = this.topicList.findIndex(topic => topic.id === this.topicList[i].parentId);
      if (this.topicList[itemIndex] !== undefined) {
        this.topicList[itemIndex].children.push(this.topicList[i]);
      }
    }
    for (let i = this.topicList.length - 1; i >= 0; i--) {
      if (this.topicList[i].parentId != null && this.topicList[i].parentId !== '') {
        this.topicList.splice(i, 1);
      }
    }
    this.children = true;
  }

  onChangeTree($event: string): void {
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
    this.openTopicList();
    console.log(this.topicList);
  }

  closeModal() {
    this.modal.close();
  }

  copyProblem() {
    this.toastr.success('Copied!', 'Success', { closeButton: true });
    this.router.navigate(['/vertical/community/admin/problem/edit/', this.exercise.id, 'copy']).then(r => {});
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
      case 7:
        this.exercise.variableGN.splice(item, 1);
        break;
      default:
    }
  }

  onDrop(event) {
    moveItemInArray(this.exercise.variantOrder, event.previousIndex, event.currentIndex);
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
      this.exercise.variantTest[index].isAnswer = event;
      console.log(this.exercise.variantTest);
    }
  }
}
