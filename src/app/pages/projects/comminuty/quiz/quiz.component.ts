import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {BasePageComponent} from '../../../base-page';
import {GenerateQuiz, Program, Questions, Variant} from '../../../../interfaces/services/projects/community.service';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {Status} from '../../../../interfaces/services/util.service';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/operators';
import * as PageActions from '../../../../store/actions/page.actions';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css']
})
export class QuizComponent extends BasePageComponent implements OnInit {

    id: string;
    successCode = '';
    errorCode = '';
    loading = false;
    langType = 'kz';
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

    quiz: GenerateQuiz[] = [
        {
            id: null,
            answerVariants: [],
            answerRelVariants: [],
            description: '',
            descriptionRu: '',
            descriptionEn: '',
            answerType: ''
        }
    ];

    question: GenerateQuiz = {
        id: null,
        answerVariants: [],
        answerRelVariants: [],
        studentAnswer: [],
        description: '',
        descriptionRu: '',
        descriptionEn: '',
        answerType: ''
    };

    program: string;
    programs: Program[];
    currentProgram: string;

    userAnswer: any = null;
    leftPosition: number = null;
    rightPosition: number = null;
    answerFill: Variant = {
        id: '',
        text: '',
        textRu: '',
        textEn: '',
        textRel: '',
        textRuRel: '',
        textEnRel: '',
        isAnswer: true,
        orderNum: 0
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
            title: 'Quiz',
            loaded: true
        };
        this.successCode = 'Successfully saved!';
        this.errorCode = 'Not saved!';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getPrograms();
    }

    initTable(): void {
        setTimeout(
            () => this.store.dispatch(new PageActions.Update({loaded: true})),
            0
        );
    }

    getPrograms() {
        this.initTable();
        this.loading = true;
        return this.http.get<Program[]>(`${environment.apiUrl}/api/project/community/programs/list`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.programs = data;
            });
    }

    selectProgram() {
        this.program = this.currentProgram;
        this.http.get<Status>(`${environment.apiUrl}/api/project/community/quiz/start/${this.program}`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                if (data.status === 1) {
                    this.id = data.value;
                    this.nextQuestion();
                    this.toastr.success(data.message, 'Success', {closeButton: true});
                } else {
                    this.toastr.error(data.message, 'Error', {closeButton: true});
                }
            });
    }

    nextQuestion() {
        // this.question.answerVariants = JSON.stringify(this.question.variants);
        this.userAnswer = {
            id: this.id,
            leftPosition: this.leftPosition,
            rightPosition: this.rightPosition,
            question: this.question,
            // answer: null
        };
        this.setAnswer(this.userAnswer);

        return this.http.post<Status>(`${environment.apiUrl}/api/project/community/quiz/individual`, this.userAnswer)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', {closeButton: true});
                        this.leftPosition = data.value.leftPosition;
                        this.rightPosition = data.value.rightPosition;
                        this.question = data.value.question;
                    } else {
                        this.toastr.error(data.message, 'Error', {closeButton: true});
                    }
                },
                error: error => {
                    this.toastr.error(error, 'Error', {closeButton: true});
                }
            });
    }

    onDrop(event, arr) {
        moveItemInArray(arr, event.previousIndex, event.currentIndex);
        for (let i = 0; i < arr.length; i++) {
            arr[i].orderNum = i + 1;
        }
    }

    private setAnswer(userAnswer: any) {
        let answer = [];
        switch (userAnswer.question.answerType) {
            case 1:
                for (let i = 0; i < this.question.answerVariants.length; i++) {
                    if (this.question.answerVariants[i].id === this.answerFill.id) {
                        this.answerFill = this.question.answerVariants[i];
                    }
                }
            // tslint:disable-next-line:no-switch-case-fall-through
            case 3:
                this.answerFill.isAnswer = true;
                answer.push(this.answerFill);
                break;
            case 2:
                for (let i = 0; i < this.question.answerVariants.length; i++) {
                    if (this.question.answerVariants[i].isAnswer) {
                        answer.push(this.question.answerVariants[i]);
                    }
                }
                break;
            case 4:
                answer = null;
                break;
            case 5:
                answer = null;
                break;
            default:
                break;
        }
        userAnswer.question.studentAnswer = answer;
    }
}
