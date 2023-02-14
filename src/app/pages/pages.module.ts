import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AgmCoreModule } from '@agm/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzMessageModule, NzDatePickerModule, NzSliderModule, NzUploadModule } from 'ng-zorro-antd';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NZ_I18N, NZ_ICONS, en_US, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';

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

import { PageAnalyticsComponent } from './dashboards/analytics';
import { Page404Component } from './errors/page-404';
import { Page500Component } from './errors/page-500';
import { Page503Component } from './errors/page-503';
import { Page505Component } from './errors/page-505';
import { PageInvoiceComponent } from './apps/service-pages/invoice';
import { PageInvoicesComponent } from './apps/service-pages/invoices';
import { PagePricingComponent } from './apps/service-pages/pricing';
import { PageTimelineComponent } from './apps/service-pages/timeline';
import { PageUserProfileComponent } from './apps/user-pages/user-profile';
import { PageEditAccountComponent } from './apps/user-pages/edit-account';
import { PageCalendarComponent } from './apps/service-pages/calendar';
import { PageSignInComponent } from './apps/authentication/sign-in';
import { PageSignUpComponent } from './apps/authentication/sign-up';
import { PageSettingsComponent } from './settings';
import { PageECommerceComponent } from './dashboards/e-commerce';
import { PageDashboardComponent } from './dashboards/dashboard';
import { PageResetPasswordComponent } from './apps/authentication/reset-password';
import { PageVerifyAccountComponent } from './apps/authentication/verify-account';
import { PageConnectionsComponent } from './apps/user-pages/connections';
import { ErrorBasePageComponent } from './errors/error-base-page';
import { PageWidgetsComponent } from './widgets';
import { PageGroupsComponent } from './apps/user-pages/groups';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ListComponent } from './lists/list/list.component';
import { EditComponent } from './lists/edit/edit.component';

import { TagInputModule } from 'ngx-chips';
import { TrimPipe } from '../ui/pipe/filter-input/trim.pipe';
import { SafeUrlPipe } from '../ui/pipe/filter-input/safeUrl.pipe';
import { ImportComponent } from './lists/import/import.component';
import { GroupsListComponent } from '../pages/groups/groups';
import { ListsComponent } from './projects/self-dev/lists';
import { SubListComponent } from './projects/self-dev/sub-list/sub-list.component';
import {SubListTableComponent} from './projects/self-dev/sub-list-table';
import {SubEditComponent} from './projects/self-dev/sub-edit';
import {EnglishProfileComponent} from './projects/english/english-profile';
import {EnglishAttendanceComponent} from './projects/english/english-attendance/english-attendance.component';
import {MiniListComponent} from './lists/mini-list';
import {EnglishEditGroupComponent} from './projects/english/english-edit-group/english-edit-group.component';
import {EnglishListComponent} from './projects/english/english-list/english-list.component';
import {SubNewActualComponent} from './projects/self-dev/sub-new-actual';
import {SubPassComponent} from './projects/self-dev/sub-pass';
import {AddCompanyComponent} from './projects/courses/companies/add';
import {CompanyListComponent} from './projects/courses/companies/list';
import {AddPackageComponent} from './projects/courses/package/add';
import {AddCourseComponent} from './projects/courses/course/add';
import {CourseMainComponent} from './projects/courses/main';
import {CourseListComponent} from './projects/courses/course/course-list';
import {CourseComponent} from './projects/courses/course/course';
import {LessonComponent} from './projects/courses/course/lesson';
import {PackageListComponent} from './projects/courses/package/package-list';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {AddModuleComponent} from './projects/courses/course/add/module';
import {AddLessonComponent} from './projects/courses/course/add/lesson';
import {FilterTopPipe} from '../ui/pipe/filter-input/filterTop.pipe';
import {PageResetPasswordConfirmComponent} from './apps/authentication/reset-password-confirm/reset-password-confirm.component';
import {SoonComponent} from './projects/soon';
import {AddTopicComponent} from './projects/comminuty/add/add-topic.component';
import {TopicListItemComponent} from './projects/comminuty/add/list-item/list-item.component';
import {AddProblemComponent} from './projects/comminuty/add-problem/add-problem.component';
import {EnglishUserProfileComponent} from './projects/english/english-user-profile/english-user-profile.component';
import {EnglishEditProfileComponent} from './projects/english/english-edit-profile/english-edit-profile.component';
import {EnglishAddGroupComponent} from './projects/english/english-add-group';
import {TCVTimelineComponent} from '../ui/components/v-timeline';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {EditReferenceComponent} from './admin/reference/edit-reference';
import {SidebarMenuComponent} from './admin/reference/widget/sidebar-menu';
import {PropertyComponent} from './admin/reference/widget/property';
import {IntegerFieldComponent} from './admin/reference/widget/fields/integer';
import {ListReferenceComponent} from './admin/reference/list-reference';
import {TreeListComponent} from './tree-list';
import {TreeChildListComponent} from './tree-list/child-list';
import {ProblemListComponent} from './projects/comminuty/problem-list/problem-list.component';
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
import {AddQuizComponent} from './projects/reads/add-problem/add-quiz.component';
import {QuizListComponent} from './projects/reads/problem-list/quiz-list.component';
import {BookListComponent} from './projects/reads/book-list/book-list.component';
import {EnglishGroupComponent} from './projects/english/english-group';
import {EnglishAddReportComponent} from './projects/english/english-add-report';
import {ViewRecordComponent} from './reference/record/view-record';
import {OwnUiModule} from '../own-ui/own-ui.module';



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
        NzMessageModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAbIFQ5ffgouATqs-sp8hgQf3zV4dTLzaU',
        }),
        LeafletModule,
        NgZorroAntdModule,
        HighlightModule,
        FullCalendarModule,
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
        TranslateModule
    ],
    declarations: [
        BasePageComponent,
        PageAnalyticsComponent,
        Page404Component,
        Page500Component,
        Page503Component,
        Page505Component,
        PageInvoiceComponent,
        PageInvoicesComponent,
        PagePricingComponent,
        PageTimelineComponent,
        PageUserProfileComponent,
        PageEditAccountComponent,
        PageCalendarComponent,
        PageSignInComponent,
        PageResetPasswordConfirmComponent,
        PageSignUpComponent,
        PageSettingsComponent,
        PageECommerceComponent,
        PageDashboardComponent,
        PageResetPasswordComponent,
        PageVerifyAccountComponent,
        PageConnectionsComponent,
        ErrorBasePageComponent,
        PageWidgetsComponent,
        PageGroupsComponent,
        ListComponent,
        FilterInputPipe,
        FilterArrayPipe,
        FilterTopPipe,
        OrderByPipe,
        EditComponent,
        TrimPipe,
        SafeUrlPipe,
        ImportComponent,
        GroupsListComponent,
        ListsComponent,
        SubListComponent,
        SubListTableComponent,
        SubEditComponent,
        EnglishProfileComponent,
        EnglishAttendanceComponent,
        EnglishGroupComponent,
        EnglishEditGroupComponent,
        MiniListComponent,
        EnglishListComponent,
        SubNewActualComponent,
        SubPassComponent,
        AddCompanyComponent,
        CompanyListComponent,
        AddPackageComponent,
        AddCourseComponent,
        CourseMainComponent,
        CourseListComponent,
        CourseComponent,
        LessonComponent,
        PackageListComponent,
        AddModuleComponent,
        AddLessonComponent,
        SoonComponent,
        AddTopicComponent,
        TopicListItemComponent,
        AddProblemComponent,
        EnglishUserProfileComponent,
        EnglishEditProfileComponent,
        EnglishAddGroupComponent,
        EnglishAddReportComponent,
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
        DateFieldComponent,
        TimestampFieldComponent,
        BooleanFieldComponent,
        EnumerationFieldComponent,
        ReferenceFieldComponent,
        SoonFieldComponent,
        TableFieldComponent,
        EditRecordComponent,
        ViewRecordComponent,
        TCFolderComponent,
        TCMiniFolderComponent,
        TCSectionComponent,
        AddQuizComponent,
        QuizListComponent,
        BookListComponent,
    ],
    exports: [
        TCMiniFolderComponent
    ],
    providers: [
        {provide: NZ_I18N, useValue: en_US},
        {provide: NZ_ICONS, useValue: icons},
        {provide: NZ_MESSAGE_CONFIG, useValue: {nzDuration: 300000, nzMaxStack: 7, nzPauseOnHover: true, nzAnimate: true}},
        MiniListComponent, TCVTimelineComponent]
})
export class PagesModule { }
