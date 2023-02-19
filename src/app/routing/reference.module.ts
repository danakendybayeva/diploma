import {Routes} from '@angular/router';
import {AuthGuard} from '../user/_helpers/auth.guard';
import {EditRecordComponent} from '../pages/reference/record/edit-record';
import {TCFolderComponent} from '../pages/reference/folder';
import {ViewRecordComponent} from '../pages/reference/record/view-record';
import {TCImportComponent} from '../pages/reference/import';
import {EditReferenceComponent} from '../pages/admin/reference/edit-reference';
import {ListReferenceComponent} from '../pages/admin/reference/list-reference';
import {ArchiveListComponent} from '../pages/apps/user-pages/archive-list';

export const REFERENCE_ROUTES: Routes = [
  {
    path: 'record',
    children: [
      { path: 'create/:referenceId', component: EditRecordComponent },
      { path: 'edit/:referenceId/:recordId', component: EditRecordComponent },
      { path: 'view/:referenceId/:recordId', component: ViewRecordComponent },
      { path: 'list/:referenceId', component: TCFolderComponent },
      { path: 'section/:referenceId/:sectionId', component: TCFolderComponent },
      { path: 'section/student-list', component: ArchiveListComponent },
    ]
  }
];

export const ADMIN_PANEL_ROUTES: Routes = [
  {
    path: 'reference',
    children: [
      { path: 'create', component: EditReferenceComponent },
      { path: 'edit/:referenceId', component: EditReferenceComponent },
      { path: 'create-field/:referenceId/:typeField', component: EditReferenceComponent },
      { path: 'edit-field/:referenceId/:typeField/:fieldId', component: EditReferenceComponent },
      { path: 'edit-field/:referenceId/:typeField/:fieldId/:sadmin', component: EditReferenceComponent },
      { path: 'edit/:referenceId/section', component: EditReferenceComponent },
      { path: 'edit/:referenceId/section/:sectionId', component: EditReferenceComponent },
      { path: 'edit/:referenceId/access', component: EditReferenceComponent },
      { path: 'list', component: ListReferenceComponent },
      { path: 'list/:referenceId/import', component: TCImportComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    runGuardsAndResolvers: 'always'
  }
];
