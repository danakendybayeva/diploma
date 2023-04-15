import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {BasePageComponent} from '../../../base-page';
import {Program, Topic} from '../../../../interfaces/services/projects/community.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Status} from '../../../../interfaces/services/util.service';
import {Content} from '../../../../ui/interfaces/modal';
import {IPageContent} from '../../../../interfaces/services/page/page-content';
import * as PageActions from '../../../../store/actions/page.actions';
import {FieldService} from '../../../../interfaces/services/reference/field.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss']
})
export class ProgramComponent extends BasePageComponent implements OnInit {
    program: Program[] = [];

    topicList: Topic[] = [];
    selectedProgram: Program = null;
    index;
    successColor = 'success';
    successIcon = 'icofont-arrow-right tc-icon-wrap';
    waitColor = 'info';
    waitIcon = 'icofont-arrow-right tc-icon-wrap';
    color = [];
    icon = [];
    children = false;
    loading = false;
    pageSize = 10;
    pageIndex = 1;
    totalData = 0;

    constructor(store: Store<IAppState>, httpSv: HttpService,
                private formBuilder: FormBuilder,
                private http: HttpClient, private router: Router,
                private route: ActivatedRoute,
                private modal: TCModalService,
                private sanitizer: DomSanitizer,
                private fieldService: FieldService,
                private toastr: ToastrService) {
        super(store, httpSv);
        this.pageData = {
            title: 'New Program',
            loaded: true
        };
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.openTopicList();
        // this.getPrograms();
        this.getListProgram();
    }

    initTable(): void {
        setTimeout(
            () => this.store.dispatch(new PageActions.Update({loaded: true})),
            0
        );
    }

    onChangePageIndex(param) {
        this.pageIndex = param;
        this.getListProgram();
    }

    getPrograms() {
        this.initTable();
        this.loading = true;
        return this.http.get<Program[]>(`${environment.apiUrl}/api/project/community/programs/list`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.program = data;
            });
    }

    getListProgram() {
        this.initTable();
        this.loading = true;
        return this.http.get<IPageContent>(`${environment.apiUrl}/api/project/community/programs/list?page=${this.pageIndex}&size=${this.pageSize}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.program = data.content;
                this.totalData = data.totalElements;
                this.loading = false;
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

    allToNotSelected() {
        for (let i = 0; i < this.program.length; i++) {
            this.color[i] = this.waitColor;
            this.icon[i] = this.waitIcon;
        }
    }

    isSelected(index: number) {
        this.allToNotSelected();
        this.color[index] = this.successColor;
        this.icon[index] = this.successIcon;
        this.selectedProgram = this.program[index];
    }

    addProgram() {
        this.program.push({id: '', title: '', relativeTopics: [], selected: false});
        this.allToNotSelected();
    }

    saveProgram(item: Program, index: number, donot = false) {
        const sUrl = `${environment.apiUrl}/api/project/community/programs/save`;
        return this.http.post<Status>(sUrl, item)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', {closeButton: true});
                        if (donot) {
                            item.id = data.value;
                            this.isSelected(index);
                        }
                        // this.router.navigate(['/vertical/community/admin/problem/edit/', this.problemId]).then(r => {});
                    } else {
                        this.toastr.error(data.message, 'Error', {closeButton: true});
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', {closeButton: true});
                }
            });
    }

    deleteProgram(index: number) {
        this.allToNotSelected();
        this.selectedProgram = null;
        // this.exercise.id
        if (this.program[index].id != null && this.program[index].id !== '') {
            this.http.delete<Status>(`${environment.apiUrl}/api/project/community/programs/delete/${this.program[index].id}`)
                .subscribe({
                    next: data => {
                        if (data.status === 1) {
                            this.toastr.success(data.message, 'Success', {closeButton: true});
                            this.program.splice(index, 1);
                            this.color.splice(index, 1);
                            this.icon.splice(index, 1);
                        } else {
                            this.toastr.success(data.message, 'Warning', {closeButton: true});
                        }
                    },
                    error: error => {
                        this.toastr.error('Not saved!', 'Error', {closeButton: true});
                    }
                });
        } else {
            this.program.splice(index, 1);
            this.color.splice(index, 1);
            this.icon.splice(index, 1);
        }
        this.modal.close();
    }

    openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null, index = -1) {
        this.index = index;
        if (this.program[index].id == null || this.program[index].id === '') {
            this.deleteProgram(index);
        } else {
            this.modal.open({
                body: body,
                header: header,
                footer: footer,
                options: options
            });
        }
    }

    closeModal() {
        this.modal.close();
    }

    // quiz() {
    //     this.router.navigate(['/vertical/community/admin/quiz/list']).then(r => {
    //     });
    // }
}
