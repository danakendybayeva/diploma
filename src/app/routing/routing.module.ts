import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerticalLayoutComponent } from '../layout/vertical';
import { HorizontalLayoutComponent } from '../layout/horizontal';
import { PublicLayoutComponent } from '../layout/public';
import { ErrorLayoutComponent } from '../layout/error';

import { PageAnalyticsComponent } from '../pages/dashboards/analytics';
import { Page404Component } from '../pages/errors/page-404';
import { Page500Component } from '../pages/errors/page-500';
import { Page503Component } from '../pages/errors/page-503';
import { Page505Component } from '../pages/errors/page-505';
import { PageInvoiceComponent } from '../pages/apps/service-pages/invoice';
import { PageInvoicesComponent } from '../pages/apps/service-pages/invoices';
import { PagePricingComponent } from '../pages/apps/service-pages/pricing';
import { PageTimelineComponent } from '../pages/apps/service-pages/timeline';
import { PageUserProfileComponent } from '../pages/apps/user-pages/user-profile';
import { PageEditAccountComponent } from '../pages/apps/user-pages/edit-account';
import { PageCalendarComponent } from '../pages/apps/service-pages/calendar';
import { PageSignInComponent } from '../pages/apps/authentication/sign-in';
import { PageSignUpComponent } from '../pages/apps/authentication/sign-up';
import { PageSettingsComponent } from '../pages/settings';
import { PageDashboardComponent } from '../pages/dashboards/dashboard';
import { PageECommerceComponent } from '../pages/dashboards/e-commerce';
import { PageResetPasswordComponent } from '../pages/apps/authentication/reset-password';
import { PageVerifyAccountComponent } from '../pages/apps/authentication/verify-account';
import { PageConnectionsComponent } from '../pages/apps/user-pages/connections';
import { PageGroupsComponent } from '../pages/apps/user-pages/groups';
import { PageWidgetsComponent } from '../pages/widgets';
import { ListComponent } from '../pages/lists/list/list.component';
import { EditComponent } from '../pages/lists/edit/edit.component';
import { ImportComponent } from '../pages/lists/import/import.component';
import { GroupsListComponent } from '../pages/groups/groups';

import { AuthGuard } from '../user/_helpers/auth.guard';
import {ListsComponent} from '../pages/projects/self-dev/lists';
import {SubListComponent} from '../pages/projects/self-dev/sub-list';
import {SubListTableComponent} from '../pages/projects/self-dev/sub-list-table';
import {SubEditComponent} from '../pages/projects/self-dev/sub-edit';
import {SubNewActualComponent} from '../pages/projects/self-dev/sub-new-actual';
import {SubPassComponent} from '../pages/projects/self-dev/sub-pass';
import {
  COMMUNITY_ROUTES,
  COURSES_ROUTES,
  ENGLISH_ROUTES, READS_ROUTES
} from './project-routing.module';
import {PageResetPasswordConfirmComponent} from '../pages/apps/authentication/reset-password-confirm/reset-password-confirm.component';
import {SoonComponent} from '../pages/projects/soon';
import {EnglishProfileComponent} from '../pages/projects/english/english-profile';
import {ADMIN_PANEL_ROUTES} from './admin-routing.module';
import {REFERENCE_ROUTES} from './reference.module';



const CHILD_ROUTES: Routes = [
  { path: 'dashboard', component: PageDashboardComponent },
  { path: 'analytics', component: PageAnalyticsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  // { path: 'invoice', component: PageInvoiceComponent },
  // { path: 'invoices', component: PageInvoicesComponent },
  // { path: 'pricing', component: PagePricingComponent },
  // { path: 'events-timeline', component: PageTimelineComponent },
  { path: 'user-profile/:id', component: PageUserProfileComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'user-profile', component: PageUserProfileComponent },
  { path: 'edit-account', component: PageEditAccountComponent },
  { path: 'events-calendar', component: PageCalendarComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'settings', component: PageSettingsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'e-commerce', component: PageECommerceComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'widgets', component: PageWidgetsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'groups', component: PageGroupsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'list', component: ListComponent },
  { path: 'profile/edit/:id', component: EditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'profile-new', component: EditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'import', component: ImportComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'groups-list', component: GroupsListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-dev-list', component: ListsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-dev-sub-list/:id', component: SubListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-dev-sub-list/:id/:profile_id', component: SubListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-dev-sub-list-table/:parentId', component: SubListTableComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-edit/:id', component: SubEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-new', component: SubEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-new-actual', component: SubNewActualComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-edit-actual/:id', component: SubNewActualComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'self-dev-pass/:id', component: SubPassComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  {
    path: 'courses',
    children: COURSES_ROUTES
  },
  {
    path: 'community',
    children: COMMUNITY_ROUTES
  },
  {
    path: 'english',
    children: ENGLISH_ROUTES
  },
  {
    path: 'reads',
    children: READS_ROUTES
  },
  { path: 'coming-soon-english', component: SoonComponent },
  { path: 'coming-soon-skills', component: SoonComponent },
  { path: 'coming-soon-community', component: SoonComponent },
  {
    path: 'admin-panel',
    children: ADMIN_PANEL_ROUTES
  },
  {
    path: 'reference',
    children: REFERENCE_ROUTES
  },
];

const PUBLIC_ROUTES: Routes = [
  { path: 'sign-in', component: PageSignInComponent },
  { path: 'sign-up', component: PageSignUpComponent },
  { path: 'forgot-password', component: PageResetPasswordComponent },
  { path: 'reset-password', component: PageResetPasswordConfirmComponent },
  { path: 'verify-account', component: PageVerifyAccountComponent },
  { path: '**', component: Page404Component }
];

const ERROR_ROUTES: Routes = [
  { path: '404', component: Page404Component },
  { path: '500', component: Page500Component },
  { path: '503', component: Page503Component },
  { path: '505', component: Page505Component },
  { path: '**', component: Page404Component }
];

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/vertical/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    children: CHILD_ROUTES,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'student', 'english_teacher'] }
    // data: { roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] }
  },
  {
    path: 'horizontal',
    component: HorizontalLayoutComponent,
    children: CHILD_ROUTES,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'student'] }
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES,
  },
  {
    path: 'error',
    component: ErrorLayoutComponent,
    children: ERROR_ROUTES
  },
  {
    path: '**',
    component: ErrorLayoutComponent,
    children: ERROR_ROUTES
  }
];

@NgModule({
  imports: [],
  exports: [RouterModule],
  declarations: [],
})
export class RoutingModule { }
