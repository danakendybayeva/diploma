import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';
import {CourseFields} from '../../../../../../interfaces/services/projects/courses.service';
import {TCExternalEditRecordComponent} from '../../../../../reference/external/record/edit-record';
import {map} from 'rxjs/operators';
import {NzFormatEmitEvent} from 'ng-zorro-antd';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Content} from '../../../../../../ui/interfaces/modal';
import {Status} from '../../../../../../interfaces/services/util.service';

@Component({
  selector: 'edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent extends TCExternalEditRecordComponent implements OnInit, OnDestroy, AfterViewChecked {
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
    newLessonTitle = '';
    newModuleTitle = '';
    newQuizTitle = '';
    selectedModule = -1;
    selectedLesson = -1;
    selectedQuiz = -1;
    addingNewModule = false;

    nzEvent(event: NzFormatEmitEvent): void {
        // console.log(event.checkedKeys);
        if (event.checkedKeys.length) {
            this.fieldsData['packages'].value = [];
            const checked = [];
            event.checkedKeys.forEach(item => {
                checked.push({
                    id: item.origin.key,
                    value: item.origin.title
                });
            });
            // console.log(checked);
            this.fieldsData['packages'].value = checked;
        }
    }

    async ngOnInit() {
        this.loaded = false;
        this.createPost = `${environment.apiUrl}/api/project/course/new`;
        this.editPost = `${environment.apiUrl}/api/project/course/edit`;
        this.fieldsData = CourseFields;
        try {
            this.fieldsData['company'].values = await this.getValues(
                `${environment.apiUrl}/api/project/course/company/list/all`,
                'display_name'
            );
            this.fieldsData['teachers'].values = await this.getValues(
                `${environment.apiUrl}/api/project/course/teacher/list/all`,
                'fio'
            );
            this.fieldsData['prerequisites_courses'].values = await this.getValues(
                `${environment.apiUrl}/api/project/course/list/all`,
                'display_name'
            );
            this.packages = await this.getPackages(`${environment.apiUrl}/api/project/course/package/list/all`);
        } catch (err) {
            console.log(err);
        }
        this.typePage = 'edit';
        this.pageData = {
          title: 'Create Course',
          loaded: true
        };
        super.ngOnInit();
        this.labelForm.addControl('search-package', this.formBuilder.control(null, []));
        this.labelForm.addControl('prerequisites_mode', this.formBuilder.control(null, []));
        if (this.recordId) {
            this.getBuildersData();
        }
        this.redirectUrl = '/vertical/courses/admin/course/edit';
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewChecked() {
        super.ngAfterViewChecked();
    }

    getRecordData(type: string = 'get') {
        return this.http.get<any>(`${environment.apiUrl}/api/project/course/get/${this.recordId}`)
            .pipe(map(data => {
              return data;
            }))
            .subscribe(
                data => {
                  if (Object.keys(data).length) {
                    Object.entries(this.fieldsData).forEach(
                        ([key, value]) => {
                          this.fieldsData[key].value = data[key];
                          if (key === 'packages') {
                              this.packagesDefaultSelected = [];
                              this.fieldsData[key].value.forEach(item => {
                                  if (item['id']) {
                                      this.packagesDefaultSelected.push(item['id']);
                                  }
                              });
                          }
                        }
                    );
                    this.pageData = {
                      title: `Курс - ${this.fieldsData['display_name'].value}`,
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

    getPackages(url): Promise<any[]> {
        return this.http.get<any[]>(url)
            .toPromise()
            .then(
                data => {
                    const result = [];
                    if (data.length) {
                        data.forEach(item => {
                            result.push({
                                title: item['display_name'],
                                key: item['id'],
                                isLeaf: true
                            });
                        });
                    }
                    return result;
                })
            .catch();
    }

    getBuildersData() {
        return this.http.get<any[]>(`${environment.apiUrl}/api/project/course/modules/builders/${this.recordId}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(
                data => {
                    const builders = [];
                    data.forEach(module => {
                        const lessons = [];
                        module['lessons'].forEach(lesson => {
                            const quizzes = [];
                            lesson['quizzes'].forEach(quiz => {
                                quizzes.push({
                                    id: quiz['id'],
                                    title: quiz['display_name']
                                });
                            });
                            lessons.push({
                                id: lesson['id'],
                                title: lesson['display_name'],
                                addingNewQuiz: false,
                                expanded: false,
                                quizzes: quizzes
                            });
                        });
                        builders.push({
                            id: module['id'],
                            title: module['display_name'],
                            expanded: false,
                            addingNewLesson: false,
                            lessons: lessons
                        });
                    });
                    this.builders = builders;
                },
                error => {}
            );
    }

    nzTabIndexChange(params) {
        this.tabShow = params;
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.builders, event.previousIndex, event.currentIndex);
        this.builderActive = event.currentIndex;
        return this.http.post<Status>(`${environment.apiUrl}/api/project/course/order/module`, {
            firstId: this.builders[event.previousIndex]['id'],
            secondId: this.builders[event.currentIndex]['id'],
            firstNum: event.previousIndex,
            secondNum: event.currentIndex
        })
            .subscribe({
                next: data => {
                    if (data.status !== 1) {
                        console.log(data.message);
                    }
                },
                error: error => {
                    console.log(error);
                }
            });
    }

    onDropLesson(event: CdkDragDrop<string[]>, index) {
        moveItemInArray(this.builders[index].lessons, event.previousIndex, event.currentIndex);
        return this.http.post<Status>(`${environment.apiUrl}/api/project/course/order/lesson`, {
            firstId: this.builders[index].lessons[event.previousIndex]['id'],
            secondId: this.builders[index].lessons[event.currentIndex]['id'],
            firstNum: event.previousIndex,
            secondNum: event.currentIndex
        })
            .subscribe({
                next: data => {
                    if (data.status !== 1) {
                        console.log(data.message);
                    }
                },
                error: error => {
                    console.log(error);
                }
            });
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
        return this.http.post<Status>(`${environment.apiUrl}/api/project/course/order/module`, {
            firstId: this.builders[index]['id'],
            secondId: this.builders[currentIndex]['id'],
            firstNum: index,
            secondNum: currentIndex
        })
            .subscribe({
                next: data => {
                    if (data.status !== 1) {
                        console.log(data.message);
                    }
                },
                error: error => {
                    console.log(error);
                }
            });
    }

    addNewLesson(index, newLessonTitle) {
        return this.http.post<Status>(`${environment.apiUrl}/api/project/course/lesson/new`, {
            display_name: newLessonTitle,
            order_num: this.builders[index].lessons.length,
            module_id: this.builders[index]['id'],
            status: [{
                id: '1', value: 'Опубликовано'
            }]
        })
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        console.log(data.value);
                        this.toastr.success(data.message, 'Success', { closeButton: true });
                        this.newLessonTitle = '';
                        const newLesson = {
                            id: data.value,
                            title: newLessonTitle,
                            expanded: false
                        };
                        this.builders[index].lessons.push(newLesson);
                        this.builders[index].addingNewLesson = false;
                    } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', { closeButton: true });
                }
            });



    }

    cancelAddingNewLesson(index) {
        this.newLessonTitle = '';
        this.builders[index].addingNewLesson = false;
    }

    addModuleLesson(newModuleTitle) {
        return this.http.post<Status>(`${environment.apiUrl}/api/project/course/module/new`, {
            display_name: newModuleTitle,
            order_num: this.builders.length,
            course_id: this.recordId,
            status: [{
                id: '1', value: 'Опубликовано'
            }]
        })
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        console.log(data.value);
                        this.toastr.success(data.message, 'Success', { closeButton: true });
                        this.newModuleTitle = '';
                        const newModule = {
                            id: data.value,
                            title: newModuleTitle,
                            expanded: false,
                            addingNewLesson: false,
                            lessons: []
                        };
                        this.builders.push(newModule);
                        this.addingNewModule = false;
                    } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', { closeButton: true });
                }
            });
    }

    cancelAddingNewModule() {
        this.newModuleTitle = '';
        this.addingNewModule = false;
    }

    addNewQuiz(indexModule, indexLesson, newQuizTitle) {
        return this.http.post<Status>(`${environment.apiUrl}/api/project/course/quiz/new`, {
            display_name: newQuizTitle,
            order_num: this.builders[indexModule].lessons[indexLesson].quiz.length,
            lesson_id: this.builders[indexModule].lessons[indexLesson]['id'],
            course_id: this.recordId,
            status: [{
                id: '1', value: 'Опубликовано'
            }]
        })
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', { closeButton: true });
                        this.newQuizTitle = '';
                        const newQuiz = {
                            id: data.value,
                            title: newQuizTitle
                        };
                        this.builders[indexModule].lessons[indexLesson].quiz.push(newQuiz);
                        this.builders[indexModule].lessons[indexLesson].addingNewQuiz = false;
                    } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', { closeButton: true });
                }
            });


    }

    cancelAddingNewQuiz(indexModule, indexLesson) {
        this.newQuizTitle = '';
        this.builders[indexModule].lessons[indexLesson].addingNewQuiz = false;
    }

    removeLesson(iModule, iLesson) {
        if (this.selectedLesson >= 0) {
            this.builders[iModule].lessons.splice(iLesson, 1);
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
}
