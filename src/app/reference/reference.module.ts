import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {UIModule} from '../ui/ui.module';
import {TCIntegerFieldComponent} from './fields/integer';
import {TCFloatFieldComponent} from './fields/float';
import {TCStringFieldComponent} from './fields/string';
import {TCDateFieldComponent} from './fields/date';
import {TCTimestampFieldComponent} from './fields/timestamp';
import {TCBooleanFieldComponent} from './fields/boolean';
import {TCEnumerationFieldComponent} from './fields/enumeration';
import {TranslateModule} from '@ngx-translate/core';
import {TCReferenceFieldComponent} from './fields/reference';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TCMiniFolderRefComponent} from './mini-folder';
import {TCStructureFieldComponent} from './fields/structure';
import {TCFactoryFieldComponent} from './fields/factory-field';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {TCPasswordFieldComponent} from './fields/password';
import {TCImageFieldComponent} from './fields/image';
import {ImageCropperModule} from 'ngx-image-cropper';
import {SecurePipe} from './pipe/secure.pipe';
import {TCFileFieldComponent} from './fields/file';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import {TCVTimelineComponent} from '../ui/components/v-timeline';
import {DeleteOutline} from '@ant-design/icons-angular/icons';
import {NzProgressModule} from 'ng-zorro-antd';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {TCTextFieldComponent} from './fields/text/text-field.component';
import {EditorModule} from '@tinymce/tinymce-angular';
import {SafeHtmlPipe} from './pipe/safeHtml.pipe';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

const icons = [ DeleteOutline ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        UIModule,
        TranslateModule,
        DragDropModule,
        NgxMaskModule.forRoot(),
        ImageCropperModule,
        NzUploadModule,
        NzModalModule,
        NzIconModule,
        NzTableModule,
        NzTabsModule,
        NzProgressModule,
        NzTreeModule,
        NzDatePickerModule,
        EditorModule,
    ],
    declarations: [
        TCIntegerFieldComponent,
        TCFloatFieldComponent,
        TCStringFieldComponent,
        TCTextFieldComponent,
        TCDateFieldComponent,
        TCTimestampFieldComponent,
        TCBooleanFieldComponent,
        TCEnumerationFieldComponent,
        TCReferenceFieldComponent,
        TCStructureFieldComponent,
        TCPasswordFieldComponent,
        TCMiniFolderRefComponent,
        TCFactoryFieldComponent,
        TCImageFieldComponent,
        TCFileFieldComponent,
        SecurePipe,
        SafeHtmlPipe,
    ],
  entryComponents: [],
  exports: [
        TCIntegerFieldComponent,
        TCFloatFieldComponent,
        TCStringFieldComponent,
        TCTextFieldComponent,
        TCDateFieldComponent,
        TCTimestampFieldComponent,
        TCBooleanFieldComponent,
        TCEnumerationFieldComponent,
        TCReferenceFieldComponent,
        TCStructureFieldComponent,
        TCPasswordFieldComponent,
        TCMiniFolderRefComponent,
        TCFactoryFieldComponent,
        TCImageFieldComponent,
        TCFileFieldComponent,
        SecurePipe,
        SafeHtmlPipe,
  ],
    providers: [
        {provide: NZ_ICONS, useValue: icons},
        TCVTimelineComponent,
        DatePipe
    ]
})
export class ReferenceModule {}
