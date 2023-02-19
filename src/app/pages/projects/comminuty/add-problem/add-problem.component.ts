import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {HttpService} from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {Content} from '../../../../ui/interfaces/modal';
import {ToastrService} from 'ngx-toastr';
import {Status} from '../../../../interfaces/services/util.service';
import {DomSanitizer} from '@angular/platform-browser';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {VariantTest} from '../../../../interfaces/services/quiz/test';
import {VariantOrder} from '../../../../interfaces/services/quiz/order-quiz';
import {VariantMatch} from '../../../../interfaces/services/quiz/match-quiz';
import {VariantFIB} from '../../../../interfaces/services/quiz/fib-quiz';
import * as PageActions from '../../../../store/actions/page.actions';
import {GenerateQuiz, Questions, Topic, Variant} from '../../../../interfaces/services/projects/community.service';
import {Variable} from '../../../../interfaces/services/quiz/generate-quiz';
import {NzFormatEmitEvent, NzTreeNodeOptions} from 'ng-zorro-antd';
import {TopicListItemComponent} from '../add/list-item/list-item.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'add-problem',
    templateUrl: './add-problem.component.html',
    styleUrls: ['./add-problem.component.scss']
})
export class AddProblemComponent extends BasePageComponent implements OnInit {

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
        // Test
        this.itemCheck = new TopicListItemComponent(modal, http, toastr);

        this.succesCode = 'Successfully saved!';
        this.errorCode = 'Not saved!';
    }

    notes = [
        'Save жасау үшін екі маңызды нарсе: <br> 1) Description <br> 2) Topic',

        'Description: <br>  1) variable жазғанда {a} деп жазу керек',

        'Variable: <br>' +
        'Name: кез-келген қайталанбайтын (result басқа)  <br>' +
        'Condition: Comming soon(ештеңе жазбасаныз болады); <br> ' +
        'Range: екеуінде сан болуы қажет <br>' +
        'Type: String(don\'t work)',

        'Assign: <br>' +
        'Name: кез-келген(result басқа) <br>' +
        'Type: Function <br>' +
        'AssignText: variable-дарды {a} деп жазу керек <br>',

        'Result: <br>' +
        'Name: result(disabled) <br>' +
        'Condition: кез келген true болатын condition жазу керек EX: 0<1, <br>' +
        'Type: Type таңдалмаса қате шығарады <br>' +
        '   1) Expression жай өрнектерді шешу үшін <br>' +
        '   2) Function теңдеу шешу үшін <br>',

        'Variants: <br>' +
        '1) Variable-дің атын жазуға болады({a} ретінде) <br>' +
        '2) Есептеу керек болса ~statement~ осылай жазылуы тиіс Ex: ~{result}+3~ немесе ~{a}+{result}*2~ <br>' +
        '3) variant-қа сөздер жазуға болады тек (~сыртында~) EX: Бала саны ~{result}+2~ және қыздар саны ~{result}*2~ <br>'
    ];

    itemCheck: TopicListItemComponent;

    // @Input() data: Topic[] = [];
    apiUrl = '';
    problemId = '';
    newTopicFromTree: Topic = null;
    topicList: Topic[] = [];
    relatedTopics = [];
    children = false;
    langType = 'kz';

    succesCode = '';
    errorCode = '';
    tinyMceSettings = {
        base_url: '/tinymce',
        suffix: '.min',
        plugins: 'link lists',
        skin: 'CUSTOM',
        content_css: 'CUSTOM',
        mode: 'none',
        statusbar: false,
        toolbar: 'formatselect | bold italic underline | bullist numlist | undo redo',
    };
    showTxt = false;

    // Types
    typeVariable = [
        // TODO Backend get Names from something
        {
            label: 'String',
            value: 'string'
        },
        {
            label: 'Integer',
            value: 'int'
        },
        {
            label: 'Float',
            value: 'float'
        }
    ];
    typeAssign = [
        {
            label: 'Function',
            value: 'function'
        }
    ];
    typeResult = [
        {
            label: 'Expression',
            value: 'expression'
        },
        {
            label: 'Function',
            value: 'function'
        }
    ];

    variables: Variable[] = [
        {
            id: '',
            name: 'result',
            type: '',
            delimiter: 0,
            condition: '',
            range: [0, 0],
            isAssign: false,
            assignText: ''
        }
    ];

    variants: Variant[] = [
        {
            id: '',
            text: '',
            textRu: '',
            textEn: '',
            textRel: '',
            textRuRel: '',
            textEnRel: '',
            isAnswer: false,
            orderNum: 0
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
        variables: this.variables,
        variants: this.variants
    };

    generateTest = {
        description: '',
        descriptionEn: '',
        descriptionRu: '',
        answerType: 0,
        variable: this.variables,
        customVariants: []
    };

    generatedTest: GenerateQuiz = {
        id: null,
        answerVariants: [],
        description: '',
        descriptionRu: '',
        descriptionEn: '',
        answerType: ''
    };

    ngOnInit() {
        super.ngOnInit();
        this.openTopicList();
        this.initRoute();
        setTimeout(() => {
            this.showTxt = true;
        }, 500);
        // Test
        // this.itemCheck;
    }

    initRoute() {
        if (this.route.snapshot.params['problemId']) {
            this.exercise.id = this.route.snapshot.params['problemId'];
            this.getData();
        }
    }

    // Data about Question
    getData() {
        return this.http.get<Questions>(`${environment.apiUrl}/api/project/community/questions/get/${this.exercise.id}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.exercise = data;
                if (this.route.snapshot.params['copied']) {
                    this.exercise.id = null;
                }
            });
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
                        this.topicList.push({id: '', title: '', key: '', children: [], parentId: null, orderNum: 0, hidden: false});
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
            if (this.topicList[i].parentId == null || this.topicList[i].parentId === '') {
                continue;
            }
            const itemIndex = this.topicList.findIndex(topic => topic.id === this.topicList[i].parentId);
            if (this.topicList[itemIndex] !== undefined) {
                this.topicList[itemIndex].children.push(this.topicList[i]);
            }
        }
        for (let i = 0; i < this.topicList.length; i++) {
            this.topicList[i].children.push({
                id: '',
                title: '+Add New Topic',
                key: 'add' + this.topicList[i].id,
                parentId: this.topicList[i].id,
                orderNum: 0,
                hidden: true,
                children: [],
                isLeaf: true,
                topicVersion: this.topicList[i].topicVersion
            });
        }
        this.topicList.push({
            id: '',
            title: '+Add New Topic',
            key: 'add',
            parentId: '',
            orderNum: 0,
            hidden: true,
            children: [],
            isLeaf: true,
            topicVersion: []
        });
        for (let i = this.topicList.length - 1; i >= 0; i--) {
            if (this.topicList[i].parentId != null && this.topicList[i].parentId !== '') {
                this.topicList.splice(i, 1);
            }
        }
        this.children = true;
    }

    nzEvent<T>(event: NzFormatEmitEvent, body: Content<T>, footer: Content<T> = null, options: any = null): void {
        const way: number[] = event.node.origin.topicVersion;
        let selectedTopics: Topic[] = this.topicList;
        for (let i = 0; i < way.length; i++) {
            selectedTopics = selectedTopics[way[i] - 1].children;
        }
        // load child async
        if (event.eventName === 'click' && event.node.origin.key.startsWith('add')) {
            const addTopic = selectedTopics.pop();
            const newTopic: Topic = {
                id: '',
                title: '',
                parentId: addTopic.parentId,
                orderNum: 0,
                hidden: true,
                children: [],
                isLeaf: false,
                topicVersion: [],
                selected: true
            };
            this.newTopicFromTree = newTopic;
            this.openModal(body, 'New Topic', footer, options);
            newTopic.orderNum = selectedTopics.length + 1;
            newTopic.topicVersion = Object.assign([], way);
            newTopic.topicVersion.push(newTopic.orderNum);
            newTopic.children.push({
                id: '',
                title: '+Add New Topic',
                key: 'add' + newTopic.id,
                parentId: newTopic.id,
                orderNum: 0,
                hidden: true,
                children: [],
                isLeaf: true,
                topicVersion: newTopic.topicVersion
            });
            addTopic.selected = false;
            newTopic.selected = true;
            selectedTopics.push(newTopic);
            selectedTopics.push(addTopic);
        }
    }

    newTopic(topic: Topic) {
        const sUrl = `${environment.apiUrl}/api/project/community/topic/new`;
        this.http.post<Status>(sUrl, topic)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success('Saved!', 'Success', {closeButton: true});
                        topic.id = data.value;
                        topic.key = data.value;
                        this.exercise.topicId = topic.id;
                    } else {
                        this.toastr.error(data.message, 'Error', {closeButton: true});
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', {closeButton: true});
                }
            });
        this.modal.close();
    }

    saveExercise() {
        const sUrl = `${environment.apiUrl}/api/project/community/questions/create/not-generated`;
        switch (this.exercise.type) {
            case 3:
            case 4:
            case 5:
                for (let i = 0; i < this.exercise.variants.length; i++) {
                    this.exercise.variants[i].isAnswer = true;
                }
                break;
            default:
                break;
        }
        this.http.post<Status>(sUrl, this.exercise)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', {closeButton: true});
                        this.exercise.id = data.value.id;
                        this.router.navigate(['/vertical/community/admin/problem/edit/', this.exercise.id]).then(r => {});
                    } else {
                        this.toastr.error(data.message, 'Error', {closeButton: true});
                    }
                },
                error: error => {
                    this.toastr.error(error, 'Error', {closeButton: true});
                }
            });
        this.modal.close();
    }

    removeProblem() {
        // this.exercise.id
        return this.http.delete<Status>(`${environment.apiUrl}/api/project/community/questions/delete/${this.exercise.id}`)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', {closeButton: true});
                        this.router.navigate(['/vertical/community/admin/problem/list']).then(r => {
                        });
                        this.closeModal();
                    } else {
                        this.toastr.error(data.message, 'Error', {closeButton: true});
                    }
                },
                error: error => {
                    this.toastr.error(error, 'Error', {closeButton: true});
                }
            });
    }

    copyProblem() {
        this.toastr.success('Copied!', 'Success', {closeButton: true});
        this.router.navigate(['/vertical/community/admin/problem/edit/', this.exercise.id, 'copy']).then(r => {
        });
    }

    duplicateText() {
        this.exercise.descriptionEn = this.exercise.description;
        this.exercise.descriptionRu = this.exercise.description;
        this.exercise.variants.forEach(obj => {
            obj.textEn = obj.text;
            obj.textRu = obj.text;
        });
        this.toastr.success('Duplicated!', 'Success', {closeButton: true});
    }

    selectTypeExercise<T>(sType, body: Content<T>, footer: Content<T> = null, options: any = null) {
        this.exercise.type = sType;
        this.openModal(body, 'Save Question', footer, options);
    }

    onDrop(event) {
        moveItemInArray(this.exercise.variants, event.previousIndex, event.currentIndex);
    }

    onChangeTree(event: NzFormatEmitEvent): void {
        console.log('onChangeTree');
    }

    trackByFn(index: any, item: any) {
        return index;
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

    addVariable(type, isAssign = false) {
        this.exercise.variables.push({
            id: '',
            name: '',
            type: '',
            delimiter: 0,
            condition: '',
            range: [0, 0],
            isAssign: isAssign,
            assignText: ''
        });
    }

    removeVariable(item, type) {
        this.exercise.variables.splice(item, 1);
    }

    addVariant(type) {
        this.exercise.variants.push({
                id: '',
                text: '',
                textRu: '',
                textEn: '',
                textRel: '',
                textRuRel: '',
                textEnRel: '',
                isAnswer: false,
                orderNum: 0
        });
    }

    removeVariant(item, type) {
        this.exercise.variants.splice(item, 1);
    }

    prepareGenerate() {
        let rangeCheck = false;
        this.generateTest.description = this.exercise.description;
        this.generateTest.descriptionRu = this.exercise.descriptionRu;
        this.generateTest.descriptionEn = this.exercise.descriptionEn;
        this.generateTest.variable = this.exercise.variables;
        // Range must be non null
        for (let i = 0; i < this.exercise.variables.length; i++) {
            if (this.exercise.variables[i].range === null || this.exercise.variables[i].range === []) {
                this.check('Range can not be null(check range)');
                rangeCheck = true;
                break;
            }
        }
        if (rangeCheck) {
            return;
        }
        this.generateTest.answerType = this.exercise.type;
        this.generateTest.customVariants = this.exercise.variants;
        return this.http.post<Status>(`${environment.apiUrl}/api/project/community/questions/generate`, this.generateTest)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', {closeButton: true});
                        this.generatedTest = data.value;
                    } else {
                        this.toastr.error(data.message, 'Error', {closeButton: true});
                    }
                },
                error: error => {
                    this.toastr.error(error, 'Error', {closeButton: true});
                }
            });
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

    check(a: any) {
        this.toastr.error(a, 'Error', {closeButton: true});
    }
}
