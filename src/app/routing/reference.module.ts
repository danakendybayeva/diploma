import {Routes} from '@angular/router';
import {AuthGuard} from '../user/_helpers/auth.guard';
import {EditRecordComponent} from '../pages/reference/record/edit-record';
import {TCFolderComponent} from '../pages/reference/folder';
import {ViewRecordComponent} from '../pages/reference/record/view-record';

export const REFERENCE_ROUTES: Routes = [
  {
    path: 'record',
    children: [
      { path: 'create/:referenceId', component: EditRecordComponent },
      { path: 'edit/:referenceId/:recordId', component: EditRecordComponent },
      { path: 'view/:referenceId/:recordId', component: ViewRecordComponent },
      { path: 'list/:referenceId', component: TCFolderComponent },
      { path: 'section/:referenceId/:sectionId', component: TCFolderComponent },
    ]
  }
];
