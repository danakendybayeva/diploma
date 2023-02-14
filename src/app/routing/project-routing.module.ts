import {Routes} from '@angular/router';
import {AddCompanyComponent} from '../pages/projects/courses/companies/add';
import {CompanyListComponent} from '../pages/projects/courses/companies/list';
import {AddPackageComponent} from '../pages/projects/courses/package/add';
import {AddCourseComponent} from '../pages/projects/courses/course/add';
import {CourseMainComponent} from '../pages/projects/courses/main';
import {CourseListComponent} from '../pages/projects/courses/course/course-list';
import {CourseComponent} from '../pages/projects/courses/course/course';
import {LessonComponent} from '../pages/projects/courses/course/lesson';
import {PackageListComponent} from '../pages/projects/courses/package/package-list';
import {AddModuleComponent} from '../pages/projects/courses/course/add/module';
import {AddLessonComponent} from '../pages/projects/courses/course/add/lesson';
import {AuthGuard} from '../user/_helpers/auth.guard';
import {AddTopicComponent} from '../pages/projects/comminuty/add/add-topic.component';
import {AddProblemComponent} from '../pages/projects/comminuty/add-problem/add-problem.component';
import {EnglishListComponent} from '../pages/projects/english/english-list';
import {EnglishUserProfileComponent} from '../pages/projects/english/english-user-profile/english-user-profile.component';
import {EnglishEditProfileComponent} from '../pages/projects/english/english-edit-profile/english-edit-profile.component';
import {EnglishAddGroupComponent} from '../pages/projects/english/english-add-group';
import {EnglishAttendanceComponent} from '../pages/projects/english/english-attendance';
import {ProblemListComponent} from '../pages/projects/comminuty/problem-list/problem-list.component';
import {AddQuizComponent} from '../pages/projects/reads/add-problem/add-quiz.component';
import {QuizListComponent} from '../pages/projects/reads/problem-list/quiz-list.component';
import {BookListComponent} from '../pages/projects/reads/book-list';
import {EnglishEditGroupComponent} from '../pages/projects/english/english-edit-group/english-edit-group.component';
import {EnglishGroupComponent} from '../pages/projects/english/english-group';
import {EnglishAddReportComponent} from '../pages/projects/english/english-add-report';



export const COURSES_ROUTES: Routes = [
  {
    path: 'companies',
    children: [
      { path: 'list', component: CompanyListComponent },
    ]
  },
  {
    path: 'admin/companies',
    children: [
      { path: 'add', component: AddCompanyComponent },
      { path: 'edit/:id', component: AddCompanyComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },


  {
    path: 'package',
    children: [
      { path: 'list/:companyId', component: PackageListComponent },
    ]
  },
  {
    path: 'admin/package',
    children: [
      { path: 'add/:companyId', component: AddPackageComponent },
      { path: 'edit/:id', component: AddPackageComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },


  {
    path: 'course',
    children: [
      { path: 'list', component: CourseListComponent },
      { path: 'list/:packageId', component: CourseListComponent },
      { path: 'list/:companyId/:packageId', component: CourseListComponent },
      { path: ':id', component: CourseComponent },
      { path: 'lesson/:id', component: LessonComponent },
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'admin/course',
    children: [
      { path: 'add/:companyId', component: AddCourseComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'add/module/:courseId', component: AddModuleComponent },
      { path: 'edit/module/:courseId/:moduleId', component: AddModuleComponent },
      { path: 'add/lesson/:courseId/:moduleId', component: AddLessonComponent },
      { path: 'edit/:id', component: AddCourseComponent },
    ],
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },


  {
    path: 'main',
    component: CourseMainComponent
  },
];

export const COMMUNITY_ROUTES: Routes = [
  {
    path: 'admin/topic',
    children: [
      { path: 'add', component: AddTopicComponent },
      // { path: 'edit/:id', component: AddCompanyComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['community_admin'] }
  },

  {
    path: 'admin/problem',
    children: [
      { path: 'add', component: AddProblemComponent },
      { path: 'add/:topicId', component: AddProblemComponent },
      { path: 'list', component: ProblemListComponent },
      { path: 'edit/:problemId', component: AddProblemComponent },
      { path: 'edit/:problemId/:copied', component: AddProblemComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['community_admin'] }
  },
];

export const ENGLISH_ROUTES: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'report/create/:reportId/:profileId',
        component: EnglishEditProfileComponent
      },
      {
        path: 'report/edit/:studentReportId',
        component: EnglishEditProfileComponent
      },
      {
        path: 'group/create',
        component: EnglishAddGroupComponent
      },
      {
        path: 'report/add/:groupId',
        component: EnglishAddReportComponent
      },
      {
        path: 'report/edit/:groupId/:reportId',
        component: EnglishAddReportComponent
      },
      {
        path: 'attendance/:id',
        component: EnglishAttendanceComponent
      },
      {
        path: 'group/edit/:groupId',
        component: EnglishEditGroupComponent
      }
    ],
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'group-list',
    component: EnglishListComponent
  },
  {
    path: 'report/view-first/:reportId/:profileId',
    component: EnglishUserProfileComponent
  },
  {
    path: 'report/view/:studentReportId',
    component: EnglishUserProfileComponent
  },
  {
    path: 'report/edit/:studentReportId',
    component: EnglishEditProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'english-add-group',
    component: EnglishAddGroupComponent,
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'report/add/:groupId',
    component: EnglishAddReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'report/edit/:id',
    component: EnglishAddReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'english-attendance/:id',
    component: EnglishAttendanceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'group/edit/:groupId',
    component: EnglishEditGroupComponent,
    canActivate: [AuthGuard],
    data: { roles: ['english_teacher', 'admin'] }
  },
  {
    path: 'group/:groupId',
    component: EnglishGroupComponent
  },
];

export const READS_ROUTES: Routes = [
  {
    path: 'admin/quiz',
    children: [
      { path: 'add', component: AddQuizComponent },
      { path: 'add/:bookId', component: AddQuizComponent },
      { path: 'edit/:id', component: AddQuizComponent },
      { path: 'edit/:id/:copied', component: AddQuizComponent },
      { path: ':bookId/list', component: QuizListComponent },
      { path: 'list/book', component: BookListComponent}
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
];
