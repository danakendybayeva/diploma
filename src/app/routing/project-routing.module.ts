import {Routes} from '@angular/router';
import {CompanyListComponent} from '../pages/projects/courses/company/list';
import {AuthGuard} from '../user/_helpers/auth.guard';
import {AddTopicComponent} from '../pages/projects/comminuty/add/add-topic.component';
import {AddProblemComponent} from '../pages/projects/comminuty/add-problem/add-problem.component';
import {ProblemListComponent} from '../pages/projects/comminuty/problem-list/problem-list.component';
import {QuizComponent} from '../pages/projects/comminuty/quiz/quiz.component';
import {ProgramComponent} from '../pages/projects/comminuty/program/program.component';
import {EditCompanyComponent} from '../pages/projects/courses/admin/company/edit';
import {ViewCompanyComponent} from '../pages/projects/courses/company/view';
import {EditPackageComponent} from '../pages/projects/courses/admin/package/edit';
import {EditTeacherComponent} from '../pages/projects/courses/admin/teacher/edit';
import {TeacherListComponent} from '../pages/projects/courses/teacher/list';
import {ViewTeacherComponent} from '../pages/projects/courses/teacher/view';
import {EditCourseComponent} from '../pages/projects/courses/admin/course/edit';
import {EditModuleComponent} from '../pages/projects/courses/admin/module/edit';
import {EditLessonComponent} from '../pages/projects/courses/admin/lesson/edit';
import {CourseListComponent} from '../pages/projects/courses/course/list';
import {EditQuizCourseComponent} from '../pages/projects/courses/admin/quiz/edit';
import {CourseListCardComponent} from '../pages/projects/courses/course/list-card/course-list-card.component';
import {ViewCourseComponent} from '../pages/projects/courses/course/view/course';
import {ViewModuleComponent} from '../pages/projects/courses/course/view/module/view-module.component';
import {ViewLessonComponent} from '../pages/projects/courses/course/view/lesson';
import {ViewQuizComponent} from '../pages/projects/courses/course/view/quiz';
import {BookListComponent} from '../pages/projects/reading/book/list';
import {CategoryListComponent} from '../pages/projects/reading/category/list';
import {RDGroupListComponent} from '../pages/projects/reading/group/list';
import {RDPeriodListComponent} from '../pages/projects/reading/group/period-list';
import {RDVoteBookComponent} from '../pages/projects/reading/group/vote-book';
import {LGGroupListComponent} from '../pages/projects/lingua/group/list';
import {LGViewGroupComponent} from '../pages/projects/lingua/group/view';
import {LGEditGroupComponent} from '../pages/projects/lingua/group/edit';
import {LGViewReportComponent} from '../pages/projects/lingua/report/view-report';
import {LGEditReportComponent} from '../pages/projects/lingua/report/edit-report';
import {WayListComponent} from '../pages/projects/edugrade/eduway/list';
import {EdutestListComponent} from '../pages/projects/edugrade/edutest/list';
import {SeminarListComponent} from '../pages/projects/edugrade/seminar/list';
import {PracticeListComponent} from '../pages/projects/edugrade/practice/list';
import {GpaListComponent} from '../pages/projects/edugrade/gpa/list';
import {GradeListComponent} from '../pages/projects/edugrade/course/list';
import {ReportComponent} from '../pages/dashboards/report';
import {PassportListComponent} from '../pages/projects/passport/list/list.component';
import {PassportDirectionsComponent} from '../pages/projects/passport/directions';
import {PassportGradeListComponent} from '../pages/projects/edugrade/passport/list';
import {AllGradeListComponent} from '../pages/projects/edugrade/grade-list';

export const COURSES_ROUTES: Routes = [
  {
    path: 'companies',
    children: [
      { path: 'list', component: CompanyListComponent },
      { path: 'view/:id', component: ViewCompanyComponent },
    ]
  },
  {
    path: 'admin/companies',
    children: [
      { path: 'add', component: EditCompanyComponent },
      { path: 'edit/:id', component: EditCompanyComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },


  {
    path: 'package',
    children: [
      // { path: 'list/:companyId', component: PackageListComponent },
    ]
  },
  {
    path: 'admin/package',
    children: [
      { path: 'add', component: EditPackageComponent },
      { path: 'edit/:id', component: EditPackageComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  {
    path: 'teacher',
    children: [
      { path: 'list', component: TeacherListComponent },
      { path: 'view/:id', component: ViewTeacherComponent },
    ]
  },
  {
    path: 'admin/teacher',
    children: [
      { path: 'add', component: EditTeacherComponent },
      { path: 'edit/:id', component: EditTeacherComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },


  {
    path: 'course',
    children: [
      { path: 'list', component: CourseListComponent },
      { path: 'main', component: CourseListCardComponent },
      { path: 'view/:id', component: ViewCourseComponent },
      { path: 'module/view/:id', component: ViewModuleComponent },
      { path: 'lesson/view/:id', component: ViewLessonComponent },
      { path: 'quiz/view/:id', component: ViewQuizComponent },
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'admin/course',
    children: [
      { path: 'add', component: EditCourseComponent },
      { path: 'edit/:id', component: EditCourseComponent },
      { path: 'module/add', component: EditModuleComponent },
      { path: 'module/edit/:id', component: EditModuleComponent },
      { path: 'lesson/add', component: EditLessonComponent },
      { path: 'lesson/edit/:id', component: EditLessonComponent },
      { path: 'quiz/add', component: EditQuizCourseComponent },
      { path: 'quiz/edit/:id', component: EditQuizCourseComponent },
    ],
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  {
    path: 'quiz',
    children: [
      // { path: 'list/:companyId', component: PackageListComponent },
    ]
  },
];

export const PASSPORT_ROUTES: Routes = [
    {
        path: 'passport',
        children: [
            { path: 'list', component: PassportListComponent },
            { path: 'new', component: PassportDirectionsComponent },
            { path: 'view/:id', component: PassportDirectionsComponent }
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city'] }
    }
];

export const COMMUNITY_ROUTES: Routes = [
    {
        path: 'admin/topic',
        children: [
            {path: 'add', component: AddTopicComponent},
            // { path: 'edit/:id', component: AddCompanyComponent },
        ],
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
    {
        path: 'admin/program', component: ProgramComponent,
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
    {
        path: 'admin/quiz', component: QuizComponent,
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
    {
        path: 'admin/problem',
        children: [
            {path: 'add', component: AddProblemComponent},
            {path: 'add/:topicId', component: AddProblemComponent},
            {path: 'list', component: ProblemListComponent},
            {path: 'edit/:problemId', component: AddProblemComponent},
            {path: 'edit/:problemId/:copied', component: AddProblemComponent},
        ],
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
];

export const LINGUA_ROUTES: Routes = [
    {
        path: 'group',
        children: [
            {
                path: 'list',
                component: LGGroupListComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city']
                }
            },
            {
                path: 'view/:id',
                component: LGViewGroupComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city']
                }
            },
            {
                path: 'edit/:id',
                component: LGEditGroupComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city']
                }
            },
            {
                path: 'edit/:id/:isDublicate',
                component: LGEditGroupComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city']
                }
            },
        ]
    },
    {
        path: 'report',
        children: [
            {
                path: 'view/:groupId/:id',
                component: LGViewReportComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city']
                }
            },
            {
                path: 'edit/:groupId/:id',
                component: LGEditReportComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'english_teacher', 'head_city']
                }
            },
        ]
    },
];

export const READING_ROUTES: Routes = [
    {
        path: 'book',
        children: [
            { path: 'list', component: BookListComponent },
            { path: 'list/:categoryId', component: BookListComponent },
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'category',
        children: [
            { path: 'list', component: CategoryListComponent },
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'group',
        children: [
            {
                path: 'list',
                component: RDGroupListComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'period-list/:groupId',
                component: RDPeriodListComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'head_city']
                }
            },
            {
                path: 'vote-book/:groupId/:periodId',
                component: RDVoteBookComponent,
                canActivate: [AuthGuard],
                data: {
                    roles: ['admin', 'mentor', 'chief', 'head_city']
                }
            },

        ],
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
        runGuardsAndResolvers: 'always'
    },

];

export const EDUGRADE_ROUTES: Routes = [
    {
        path: 'eduway',
        children: [
            { path: 'list', component: WayListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'edutest',
        children: [
            { path: 'list', component: EdutestListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'seminar',
        children: [
            { path: 'list', component: SeminarListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'practice',
        children: [
            { path: 'list', component: PracticeListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'course',
        children: [
            { path: 'list', component: GradeListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'gpa',
        children: [
            { path: 'list', component: GpaListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'passport',
        children: [
            { path: 'list', component: PassportGradeListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
    {
        path: 'grade',
        children: [
            { path: ':edutype/list', component: AllGradeListComponent },
        ],
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        },
    },
];

export const REPORT_PROJECT_ROUTES: Routes = [
    {
        path: 'report',
        component: ReportComponent,
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        data: {
            roles: ['admin', 'mentor', 'chief', 'head_city']
        }
    }
];
