import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import {NZ_I18N, en_US, NZ_DATE_CONFIG} from 'ng-zorro-antd/i18n';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { DeleteOutline } from '@ant-design/icons-angular/icons';

import { FilterInputPipe } from '../ui/pipe/filter-input/filterInput.pipe';
import { FilterArrayPipe } from '../ui/pipe/filter-input/filterArray.pipe';
import { OrderByPipe } from '../ui/pipe/filter-input/orderBy.pipe';

import { KatexModule } from 'ng-katex';
import { EditorModule } from '@tinymce/tinymce-angular';

const icons = [ DeleteOutline ];

import { HighlightModule } from 'ngx-highlightjs';

import xml from 'highlight.js/lib/languages/xml';

export function hljsLanguages() {
  return [{ name: 'xml', func: xml }];
}

import { UIModule } from '../ui/ui.module';
import { LayoutModule } from '../layout/layout.module';
import { BasePageComponent } from './base-page';
import {ReferenceModule} from '../reference/reference.module';

import { Page404Component } from './errors/page-404';
import { Page500Component } from './errors/page-500';
import { Page503Component } from './errors/page-503';
import { Page505Component } from './errors/page-505';
import { PageUserProfileComponent } from './apps/user-pages/user-profile';
import { PageEditAccountComponent } from './apps/user-pages/edit-account';
import { PageSignInComponent } from './apps/authentication/sign-in';
import { PageSignUpComponent } from './apps/authentication/sign-up';
import { PageSettingsComponent } from './settings';
import { PageDashboardComponent } from './dashboards/dashboard';
import { PageResetPasswordComponent } from './apps/authentication/reset-password';
import { PageVerifyAccountComponent } from './apps/authentication/verify-account';
import { PageConnectionsComponent } from './apps/user-pages/connections';
import { ErrorBasePageComponent } from './errors/error-base-page';
import { PageWidgetsComponent } from './widgets';
import { PageGroupsComponent } from './apps/user-pages/groups';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { TagInputModule } from 'ngx-chips';
import { TrimPipe } from '../ui/pipe/filter-input/trim.pipe';
import { SafeUrlPipe } from '../ui/pipe/filter-input/safeUrl.pipe';
import { GroupsListComponent } from './groups/groups';
import {CompanyListComponent} from './projects/courses/company/list';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {FilterTopPipe} from '../ui/pipe/filter-input/filterTop.pipe';
import {PageResetPasswordConfirmComponent} from './apps/authentication/reset-password-confirm';
import {SoonComponent} from './projects/soon';
import {AddTopicComponent} from './projects/comminuty/add';
import {TopicListItemComponent} from './projects/comminuty/add/list-item/list-item.component';
import {AddProblemComponent} from './projects/comminuty/add-problem';
import {TCVTimelineComponent} from '../ui/components/v-timeline';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {EditReferenceComponent} from './admin/reference/edit-reference';
import {SidebarMenuComponent} from './admin/reference/widget/sidebar-menu';
import {PropertyComponent} from './admin/reference/widget/property';
import {IntegerFieldComponent} from './admin/reference/widget/fields/integer';
import {ListReferenceComponent} from './admin/reference/list-reference';
import {TreeListComponent} from './tree-list';
import {TreeChildListComponent} from './tree-list/child-list';
import {ProblemListComponent} from './projects/comminuty/problem-list';
import {ActionFieldsComponent} from './admin/reference/widget/fields/action-fields';
import {FloatFieldComponent} from './admin/reference/widget/fields/float';
import {StringFieldComponent} from './admin/reference/widget/fields/string';
import {DateFieldComponent} from './admin/reference/widget/fields/date';
import {TimestampFieldComponent} from './admin/reference/widget/fields/timestamp';
import {BooleanFieldComponent} from './admin/reference/widget/fields/boolean';
import {EnumerationFieldComponent} from './admin/reference/widget/fields/enumeration';
import {ReferenceFieldComponent} from './admin/reference/widget/fields/reference';
import {SoonFieldComponent} from './admin/reference/widget/fields/soon';
import {EditRecordComponent} from './reference/record/edit-record';
import {TranslateModule} from '@ngx-translate/core';
import {TCFolderComponent} from './reference/folder';
import {TCSectionComponent} from './admin/reference/widget/section';
import {TableFieldComponent} from './admin/reference/widget/fields/table';
import {TCMiniFolderComponent} from './reference/mini-folder';
import {ViewRecordComponent} from './reference/record/view-record';
import {OwnUiModule} from '../own-ui/own-ui.module';
import {StructureFieldComponent} from './admin/reference/widget/fields/structure';
import {PageStructureComponent} from './apps/structure';
import {TCImportComponent} from './reference/import';
import {PasswordFieldComponent} from './admin/reference/widget/fields/password';
import {ImageFieldComponent} from './admin/reference/widget/fields/image';
import {PageEditProfileComponent} from './apps/user-pages/edit-profile';
import {FileFieldComponent} from './admin/reference/widget/fields/file';
import {NgxMaskModule} from 'ngx-mask';
import {
    NzCardModule,
    NzCarouselModule,
    NzInputModule,
    NzProgressModule,
    NzSelectModule,
    NzStatisticModule,
    NzSwitchModule
} from 'ng-zorro-antd';
import {NgApexchartsModule} from 'ng-apexcharts';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {PageTwoFactorComponent} from './apps/authentication/two-factor';
import { QuizComponent } from './projects/comminuty/quiz/quiz.component';
import { ProgramComponent } from './projects/comminuty/program/program.component';
import {TextFieldComponent} from './admin/reference/widget/fields/text';
import {EditCompanyComponent} from './projects/courses/admin/company/edit';
import {TCExternalEditRecordComponent} from './reference/external/record/edit-record';
import {ViewCompanyComponent} from './projects/courses/company/view';
import {EditPackageComponent} from './projects/courses/admin/package/edit';
import {EditTeacherComponent} from './projects/courses/admin/teacher/edit';
import {TeacherListComponent} from './projects/courses/teacher/list';
import {ViewTeacherComponent} from './projects/courses/teacher/view';
import {EditCourseComponent} from './projects/courses/admin/course/edit';
import {EditModuleComponent} from './projects/courses/admin/module/edit';
import {EditLessonComponent} from './projects/courses/admin/lesson/edit';
import {CourseListComponent} from './projects/courses/course/list';
import {EditQuizCourseComponent} from './projects/courses/admin/quiz/edit';
import {CourseListCardComponent} from './projects/courses/course/list-card';
import {CourseCardComponent} from './projects/courses/course/card';
import {ViewCourseComponent} from './projects/courses/course/view/course';
import {CourseCardSidebarComponent} from './projects/courses/course/card-sidebar';
import {ViewModuleComponent} from './projects/courses/course/view/module';
import {ViewLessonComponent} from './projects/courses/course/view/lesson';
import {EmbedIdPipe} from '../ui/pipe/embedId.pipe';
import {NotFoundPageComponent} from './errors/not-found-page';
import {ViewQuizComponent} from './projects/courses/course/view/quiz';
import {TCAccessComponent} from './admin/reference/widget/access';
import {BookListComponent} from './projects/reading/book/list';
import {FolderExtendComponent} from './reference/external/folder';
import {CategoryListComponent} from './projects/reading/category/list';
import {RDGroupListComponent} from './projects/reading/group/list';
import {RDPeriodListComponent} from './projects/reading/group/period-list';
import {RDVoteBookComponent} from './projects/reading/group/vote-book';
import {LGGroupListComponent} from './projects/lingua/group/list';
import {LGViewGroupComponent} from './projects/lingua/group/view';
import {LGEditGroupComponent} from './projects/lingua/group/edit';
import {TCExternalViewRecordComponent} from './reference/external/record/view-record';
import {MapToStringPipe} from '../ui/pipe/filter-input/mapToString.pipe';
import {LGViewReportComponent} from './projects/lingua/report/view-report';
import {LGEditReportComponent} from './projects/lingua/report/edit-report';
import {WayListComponent} from './projects/edugrade/eduway/list';
import {EdutestListComponent} from './projects/edugrade/edutest/list';
import {SeminarListComponent} from './projects/edugrade/seminar/list';
import {PracticeListComponent} from './projects/edugrade/practice/list';
import {GpaListComponent } from './projects/edugrade/gpa/list';
import {GradeListComponent } from './projects/edugrade/course/list';
import {PageAnalyticsComponent} from './dashboards/analytics';
import {ReportComponent} from './dashboards/report';
import {LinguaReportTableComponent} from './projects/lingua/report-table';
import {ReadingReportTableComponent} from './projects/reading/report-table';
import { EdugradeReportTableComponent } from './projects/edugrade/report-table';
import { PassportDirectionsComponent } from './projects/passport/directions';
import { PassportListComponent } from './projects/passport/list';
import { PassportImgComponent} from './projects/passport/passport-img';
import { PassportGradeListComponent} from './projects/edugrade/passport/list';
import { PassportReportTableComponent } from './projects/passport/report-table';
import { HabitListComponent } from './projects/habit/list';
import { ReportTableComponent } from './dashboards/report/report-table/report-table.component';
import { ArchiveListComponent } from './apps/user-pages/archive-list/archive-list.component';
import { InlineSVGModule} from 'ng-inline-svg';
import { AllGradeListComponent } from './projects/edugrade/grade-list';


registerLocaleData(en);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ChartsModule,
        NgxChartsModule,
        NgxEchartsModule,
        LeafletModule,
        HighlightModule,
        UIModule,
        ReferenceModule,
        OwnUiModule,
        LayoutModule,
        NgSelectModule,
        TagInputModule,
        IvyCarouselModule,
        DragDropModule,
        KatexModule,
        EditorModule,
        NzUploadModule,
        NzPopoverModule,
        NzEmptyModule,
        NzButtonModule,
        NzTableModule,
        NzDropDownModule,
        NzIconModule,
        NzMessageModule,
        NzCollapseModule,
        NzTabsModule,
        NzTreeModule,
        NzTreeSelectModule,
        NzModalModule,
        NzProgressModule,
        TranslateModule,
        NgxMaskModule,
        NgApexchartsModule,
        NzDatePickerModule,
        NzDividerModule,
        NzSpinModule,
        NzRadioModule,
        NzAffixModule,
        NzBreadCrumbModule,
        NzSliderModule,
        NzDrawerModule,
        NzCarouselModule,
        NzInputModule,
        NzStatisticModule,
        NzCardModule,
        NzSwitchModule,
        InlineSVGModule,
        NzSelectModule,
    ],
    declarations: [
        BasePageComponent,
        Page404Component,
        Page500Component,
        Page503Component,
        Page505Component,
        PageUserProfileComponent,
        PageEditAccountComponent,
        PageSignInComponent,
        PageResetPasswordConfirmComponent,
        PageSignUpComponent,
        PageTwoFactorComponent,
        PageSettingsComponent,
        PageDashboardComponent,
        PageAnalyticsComponent,
        PageResetPasswordComponent,
        PageVerifyAccountComponent,
        PageConnectionsComponent,
        ErrorBasePageComponent,
        PageWidgetsComponent,
        PageGroupsComponent,
        FilterInputPipe,
        FilterArrayPipe,
        FilterTopPipe,
        OrderByPipe,
        TrimPipe,
        MapToStringPipe,
        SafeUrlPipe,
        GroupsListComponent,
        CompanyListComponent,
        SoonComponent,
        AddTopicComponent,
        TopicListItemComponent,
        AddProblemComponent,
        EditReferenceComponent,
        SidebarMenuComponent,
        PropertyComponent,
        ListReferenceComponent,
        ProblemListComponent,
        TreeListComponent,
        TreeChildListComponent,
        ActionFieldsComponent,
        IntegerFieldComponent,
        FloatFieldComponent,
        StringFieldComponent,
        TextFieldComponent,
        PasswordFieldComponent,
        ImageFieldComponent,
        DateFieldComponent,
        TimestampFieldComponent,
        BooleanFieldComponent,
        EnumerationFieldComponent,
        ReferenceFieldComponent,
        SoonFieldComponent,
        TableFieldComponent,
        StructureFieldComponent,
        EditRecordComponent,
        ViewRecordComponent,
        TCFolderComponent,
        TCMiniFolderComponent,
        FolderExtendComponent,
        TCSectionComponent,
        TCAccessComponent,
        PageStructureComponent,
        TCImportComponent,
        PageEditProfileComponent,
        FileFieldComponent,
        QuizComponent,
        ProgramComponent,
        EditCompanyComponent,
        TCExternalEditRecordComponent,
        ViewCompanyComponent,
        EditPackageComponent,
        EditTeacherComponent,
        TeacherListComponent,
        ViewTeacherComponent,
        EditCourseComponent,
        EditModuleComponent,
        EditLessonComponent,
        CourseListComponent,
        EditQuizCourseComponent,
        CourseListCardComponent,
        CourseCardComponent,
        ViewCourseComponent,
        CourseCardSidebarComponent,
        ViewModuleComponent,
        ViewLessonComponent,
        ViewQuizComponent,
        EmbedIdPipe,
        NotFoundPageComponent,
        BookListComponent,
        CategoryListComponent,
        RDGroupListComponent,
        RDPeriodListComponent,
        RDVoteBookComponent,
        LGGroupListComponent,
        LGViewGroupComponent,
        LGEditGroupComponent,
        TCExternalViewRecordComponent,
        LGViewReportComponent,
        LGEditReportComponent,
        WayListComponent,
        EdutestListComponent,
        SeminarListComponent,
        PracticeListComponent,
        GpaListComponent,
        GradeListComponent,
        ReportComponent,
        LinguaReportTableComponent,
        ReadingReportTableComponent,
        EdugradeReportTableComponent,
        PassportDirectionsComponent,
        PassportListComponent,
        PassportImgComponent,
        PassportGradeListComponent,
        PassportReportTableComponent,
        HabitListComponent,
        ReportTableComponent,
        ArchiveListComponent,
        AllGradeListComponent
    ],
    exports: [
        TCMiniFolderComponent,
        SafeUrlPipe,
        EmbedIdPipe,
        TrimPipe,
        MapToStringPipe,
    ],
    providers: [
        {provide: NZ_I18N, useValue: en_US},
        {provide: NZ_ICONS, useValue: icons},
        // {provide: NZ_MESSAGE_CONFIG, useValue: {nzDuration: 300000, nzMaxStack: 7, nzPauseOnHover: true, nzAnimate: true}},
        {provide: NZ_DATE_CONFIG, useValue: { firstDayOfWeek: 1 }},
        TCVTimelineComponent,
        DatePipe,
    ]
})
export class PagesModule { }
