import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {Store} from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import {HttpService} from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import * as PageActions from '../../../../store/actions/page.actions';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IPageContent} from '../../../../interfaces/services/page/page-content';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {Program, Questions, Topic} from '../../../../interfaces/services/projects/community.service';

@Component({
    selector: 'community-problem-list',
    templateUrl: './problem-list.component.html',
    styleUrls: ['./problem-list.component.scss']
})
export class ProblemListComponent extends BasePageComponent implements OnInit {
    isNew = true;

    referenceId = '';
    typeField = null;

    pageSize = 20;
    pageIndex = 1;
    totalData = 0;
    loading = false;

    topicIds = [];
    relatedTopics = [];
    topicList: Topic[] = [];
    programList: Program[] = [];
    programList1 = [];
    program = '';

    questions: Questions[] = [];
    children = false;

    sortData = {};
    queryParams: any = {};
    routeSnapshot = '';

    constructor(store: Store<IAppState>, httpSv: HttpService,
                private formBuilder: FormBuilder,
                private http: HttpClient, private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fieldService: FieldService
    ) {
        super(store, httpSv);
        this.pageData = {
            title: 'Problems List',
            loaded: true
        };
    }

    ngOnInit() {
        super.ngOnInit();
        this.getListQuestion();
        this.getListQuestion1();
        this.openTopicList();
        this.openProgramList();
    }

    initTable(): void {
        setTimeout(
            () => this.store.dispatch(new PageActions.Update({loaded: true})),
            0
        );
        this.routeSnapshot = this.route.snapshot['_routerState'].url;
        const urlTree = this.router.parseUrl(this.routeSnapshot);
        this.routeSnapshot = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
        this.renderQueryParams(this.queryParams);

    }

    getListQuestion() {
        this.initTable();
        this.loading = true;
        return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/community/questions/list?page=${this.pageIndex}&size=${this.pageSize}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.questions = data.content;
                this.totalData = data.totalElements;
                this.loading = false;
            });
    }

    getListQuestion1() {
        this.initTable();
        this.loading = true;
        const body: any = {};
        body['byProgram'] = false;
        body['topics'] = this.topicIds;
        body['relatedTopics'] = this.relatedTopics;
        body['program'] = this.program;
        if (this.program !== '' && this.program !== null) {
            body['byProgram'] = true;
        }
        // console.log(body);
        return this.http.post<IPageContent>(`${environment.apiUrl}/api/project/community/questions/list`
            + `?page=${this.pageIndex}&size=${this.pageSize}${this.prepareParamsFields()}`, body)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                // this.dataRecord = data.content.splice(1);
                // console.log(data);
            });
    }

    onChangePageIndex(param) {
        this.pageIndex = param;
        this.loading = true;
        this.getListQuestion();
        this.getListQuestion1();
        this.renderQueryParams({page: this.pageIndex});
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

    onChangeSort(param): void {
        // console.log(param);
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
        this.getListQuestion();
        this.getListQuestion1();
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
        }).then(r => {});
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

    gotoByUrl(urlGoto: string) {
        this.router.navigate([urlGoto]).then(r => {
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
        for (let i = this.topicList.length - 1; i >= 0; i--) {
            if (this.topicList[i].parentId != null && this.topicList[i].parentId !== '') {
                this.topicList.splice(i, 1);
            }
        }
        this.children = true;
    }

    openProgramList() {
        // this.initTable();
        // this.loading = true;
        return this.http.get<Program[]>(`${environment.apiUrl}/api/project/community/programs/list`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.programList = data;
                for (let i = 0; i < this.programList.length; i++) {
                    this.programList1.push({
                        label: this.programList[i].title,
                        value: this.programList[i].id
                    });
                }
                this.programList1.push({
                    label: 'None',
                    value: ''
                });
            });
    }

    onChangeTree($event: string): void {
        // console.log('');
    }

    updateFilter() {
        this.pageIndex = 1;
        const fieldParam = {'page': this.pageIndex};
        this.renderQueryParams(fieldParam);
        this.getListQuestion();
        this.getListQuestion1();
    }

    resetFilter() {
        this.queryParams = {};
        this.topicIds = [];
        this.relatedTopics = [];
        this.program = '';
        this.updateFilter();
    }
}
