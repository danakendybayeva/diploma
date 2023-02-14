import {Routes} from '@angular/router';
import {AuthGuard} from '../user/_helpers/auth.guard';
import {EditReferenceComponent} from '../pages/admin/reference/edit-reference';
import {IntegerFieldComponent} from '../pages/admin/reference/widget/fields/integer';
import {ListReferenceComponent} from '../pages/admin/reference/list-reference';

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
      { path: 'list', component: ListReferenceComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    runGuardsAndResolvers: 'always'
  }
];
