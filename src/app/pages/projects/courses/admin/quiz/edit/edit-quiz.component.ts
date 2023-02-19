import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';
import {QuizFields} from '../../../../../../interfaces/services/projects/courses.service';
import {TCExternalEditRecordComponent} from '../../../../../reference/external/record/edit-record';
import {map} from 'rxjs/operators';
import {NzFormatEmitEvent} from 'ng-zorro-antd';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Content} from '../../../../../../ui/interfaces/modal';
import {Status} from '../../../../../../interfaces/services/util.service';

@Component({
  selector: 'edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizCourseComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
    loaded = false;
    url = '';
    postImage = environment.apiUrl + '/api/project/course/media/request-file/image';
    getImageUrl = environment.apiUrl + '/api/project/course/media/';
    tabShow = 0;

    searchPackages = '';
    packages = [];
    packagesDefaultSelected = [];

    builderActive = 0;
    builders = [];
    newQuestionTitle = '';
    newAnswerTitle = '';
    newQuizTitle = '';
    selectedModule = -1;
    selectedLesson = -1;
    selectedQuiz = -1;
    addingNewQuestion = false;

    quizType = [
        {value: 'test', label: 'Test'},
        {value: 'multiple', label: 'Multiple choice'},
    ];

    editString = '';

    nzEvent(event: NzFormatEmitEvent): void {
        console.log(event.checkedKeys);
        if (event.checkedKeys.length) {
            this.fieldsData['packages'].value = [];
            const checked = [];
            event.checkedKeys.forEach(item => {
                checked.push({
                    id: item.origin.key,
                    value: item.origin.title
                });
            });
            console.log(checked);
            this.fieldsData['packages'].value = checked;
        }
    }

    ngOnInit() {
        this.loaded = false;
        this.createPost = `${environment.apiUrl}/api/project/course/quiz/new`;
        this.editPost = `${environment.apiUrl}/api/project/course/quiz/edit`;
        this.fieldsData = QuizFields;
        this.typePage = 'edit';
        this.pageData = {
          title: 'Create Quizzes',
          loaded: true
        };
        super.ngOnInit();
        if (this.recordId) {
            // this.getBuildersData();
        }
        this.redirectUrl = '/vertical/courses/admin/course/quiz/edit';
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
    }

    getRecordData(type: string = 'get') {
        return this.http.get<any>(`${environment.apiUrl}/api/project/course/quiz/get/${this.recordId}`)
            .pipe(map(data => {
              return data;
            }))
            .subscribe(
                data => {
                        if (Object.keys(data).length) {
                            Object.entries(this.fieldsData).forEach(
                                ([key, value]) => {
                                    this.fieldsData[key].value = data[key];
                                    if (key === 'questions') {
                                        this.builders = data[key];
                                    }
                                }
                            );
                            this.builders.forEach((item, key) => {
                                this.builders[key]['edit'] = false;
                            });
                            console.log(this.builders);
                            this.pageData = {
                                title: `Quiz - ${this.fieldsData['display_name'].value}`,
                                loaded: true
                            };
                            this.superOnInit();
                            this.loaded = true;
                        } else {
                            this.isEmpty = true;
                        }
                },
                error => {
                  this.isEmpty = true;
                });
    }

    getValues(url, displayName): Promise<any[]> {
        return this.http.get<any[]>(url)
            .toPromise()
            .then(
                data => {
                    const result = [];
                    if (data.length) {
                        data.forEach(item => {
                            result.push({
                                id: item['id'],
                                value: item[displayName],
                                selected: false
                            });
                        });

                    }
                    return result;
                });
    }

    nzTabIndexChange(params) {
        this.tabShow = params;
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.builders, event.previousIndex, event.currentIndex);
        this.builderActive = event.currentIndex;
    }

    onDropAnswer(event: CdkDragDrop<string[]>, index) {
        moveItemInArray(this.builders[index].answers, event.previousIndex, event.currentIndex);
    }

    expandedBlock(index) {

    }

    changeOrderNum(index, type) {
        let currentIndex = index;
        switch (type) {
            case 'up':
                moveItemInArray(this.builders, index, index - 1);
                currentIndex = index - 1;
                break;
            case 'down':
                moveItemInArray(this.builders, index, index + 1);
                currentIndex = index + 1;
                break;
        }
    }

    addNewAnswer(index, newAnswerTitle) {
        const newLesson = {
            id: this.builders[index].answers.length,
            title: newAnswerTitle,
            isAnswer: false,
            edit: false
        };
        this.builders[index].answers.push(newLesson);
        this.builders[index].addingNewAnswer = false;
        this.newAnswerTitle = '';

    }

    cancelAddingNewAnswer(index) {
        this.newAnswerTitle = '';
        this.builders[index].addingNewAnswer = false;
    }

    addNewQuestion(newQuestionTitle) {
        const newQuestion = {
            id: this.builders.length,
            title: newQuestionTitle,
            expanded: false,
            addingNewAnswer: false,
            type: 'test',
            answer: null,
            answers: [],
            edit: false
        };
        this.builders.push(newQuestion);
        this.addingNewQuestion = false;
        this.newQuestionTitle = '';
    }

    cancelAddingNewQuestion() {
        this.newQuestionTitle = '';
        this.addingNewQuestion = false;
    }

    removeAnswer(iModule, iLesson) {
        if (this.selectedLesson >= 0) {
            this.builders[iModule].answers.splice(iLesson, 1);
        }
        this.selectedModule = -1;
        this.selectedLesson = -1;
        this.modal.close();
    }

    openModal<T>(
        body: Content<T>,
        header: Content<T> = null,
        footer: Content<T> = null,
        options: any = null,
        iModule = -1,
        iLesson = -1,
        iQuiz = -1
    ) {
        this.selectedModule = iModule;
        this.selectedLesson = iLesson;
        this.selectedQuiz = iQuiz;
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

    prepareValues() {
        this.fieldsData['questions'] = {
            value: this.builders
        };
        this.fieldsData['questions'].value.forEach((item, key) => {
            item.expanded = false;
            delete item['edit'];
            item.answers.forEach((item2, key2) => {
                delete item2['edit'];
            });
        });
        super.prepareValues();
    }

    editText(index: number, type: string = 'question', qIndex = -1) {
        this.builders.forEach((item, key) => {
            this.builders[key]['edit'] = false;
            item.answers.forEach((item2, key2) => {
                this.builders[key].answers[key2]['edit'] = false;
            });
        });
        if (type === 'question') {
            this.builders[index]['edit'] = true;
            this.editString = this.builders[index].title;
        } else if (type === 'answer' && qIndex > -1) {
            this.builders[qIndex].answers[index]['edit'] = true;
            this.editString = this.builders[qIndex].answers[index].title;
        }
    }

    saveEditText(index: number, type: string = 'question', qIndex = -1) {
        if (type === 'question') {
            this.builders[index]['edit'] = false;
            this.builders[index].title = this.editString;
        } else if (type === 'answer' && qIndex > -1) {
            this.builders[qIndex].answers[index]['edit'] = false;
            this.builders[qIndex].answers[index].title = this.editString;
        }
    }
}
