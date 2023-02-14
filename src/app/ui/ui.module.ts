import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DragulaModule } from 'ng2-dragula';

import { TCBorderColorDirective } from './directives/border-color/border-color.directive';
import { TCFilterTableDirective } from './directives/filter-table/filter-table.directive';
import { TCBorderStyleDirective } from './directives/border-style/border-style.directive';
import { TCCardHeaderDirective } from './directives/card-header/card-header.directive';
import { TCSortTableDirective } from './directives/sort-table/sort-table.directive';
import { TCBgColorDirective } from './directives/bg-color/bg-color.directive';
import { TCGradientDirective } from './directives/gradient/gradient.directive';
import { TCColorDirective } from './directives/color/color.directive';
import { TCShapeDirective } from './directives/shape/shape.directive';
import { TCFocusDirective } from './directives/focus/focus.directive';
import { TCFontSizeDirective } from './directives/font-size/font-size.directive';
import { TCAlignDirective } from './directives/align/align.directive';

import { TCDropdownComponent, TCDropdownButtonComponent, TCDropdownContentComponent} from './components/dropdown';
import { TCButtonComponent } from './components/button';
import { TCCardComponent } from './components/card';
import { TCInputComponent } from './components/input';
import { TCFormDescriptionComponent } from './components/form-description';
import { TCFormGroupComponent } from './components/form-group';
import { TCFormLabelComponent } from './components/form-label';
import { TCPaginationComponent } from './components/pagination';
import { TCCheckboxComponent } from './components/checkbox';
import { TCTextareaComponent } from './components/textarea';
import { TCContactComponent } from './components/contact';
import { TCSwitcherComponent } from './components/switcher';
import { TCAutocompleteComponent } from './components/autocomplete';
import { TCRadioComponent, TCRadioOptionComponent } from './components/radio';
import { TCBadgeComponent } from './components/badge';
import { TCIconComponent } from './components/icon';
import { TCVTimelineComponent } from './components/v-timeline';
import { TCSelectComponent } from './components/select';
import { TCAlertComponent } from './components/alert';
import { TCRatingComponent } from './components/rating';
import { TCAvatarComponent, TCAvatarGroupComponent } from './components/avatar';
import { TCModalComponent } from './components/modal';

import { TCListImageSizeDirective } from './directives/list-image-size/list-image-size.directive';
import { TCListAvatarDirective } from './directives/list-avatar/list-avatar.directive';
import { TCListIconDirective } from './directives/list-icon/list-icon.directive';
import { TCListLineDirective } from './directives/list-line/list-line.directive';

import { TCColorPickerComponent, TCPickerComponent } from './components/color-picker';
import { TCListComponent, TCListItemComponent } from './components/list';
import { TCCircleProgressComponent } from './components/circle-progress';
import { TCGroupComponent } from './components/group';
import { TCGroupSkillsComponent } from './components/group-skills';
import { TCProgressComponent } from './components/progress';
import { TCUserComponent } from './components/user';
import { OutsideClickDirective } from './directives/outside-click/outside-click.directive';
import {TCAutocompleteMdsComponent} from './components/autocomplete-mds';
import {TCGroupEnglishComponent} from './components/group-english';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    DragulaModule.forRoot(),
  ],
  declarations: [
    TCBgColorDirective,
    TCBorderColorDirective,
    TCCardHeaderDirective,
    TCBorderStyleDirective,
    TCColorDirective,
    TCFocusDirective,
    TCGradientDirective,
    TCShapeDirective,
    TCFontSizeDirective,
    TCAlignDirective,
    TCSortTableDirective,
    TCFilterTableDirective,
    TCListLineDirective,

    TCButtonComponent,
    TCCardComponent,
    TCInputComponent,
    TCTextareaComponent,
    TCFormDescriptionComponent,
    TCFormGroupComponent,
    TCFormLabelComponent,
    TCPaginationComponent,
    TCCheckboxComponent,
    TCContactComponent,
    TCSwitcherComponent,
    TCAutocompleteComponent,
    TCAutocompleteMdsComponent,
    TCRadioComponent,
    TCRadioOptionComponent,
    TCBadgeComponent,
    TCDropdownComponent,
    TCDropdownButtonComponent,
    TCDropdownContentComponent,
    TCIconComponent,
    TCVTimelineComponent,
    TCSelectComponent,
    TCAlertComponent,
    TCRatingComponent,
    TCAvatarComponent,
    TCColorPickerComponent,
    TCPickerComponent,
    TCModalComponent,
    TCListComponent,
    TCListItemComponent,
    TCListAvatarDirective,
    TCListIconDirective,
    TCListImageSizeDirective,
    TCProgressComponent,
    TCCircleProgressComponent,
    TCAvatarGroupComponent,
    TCUserComponent,
    TCGroupComponent,
    TCGroupSkillsComponent,
    TCGroupEnglishComponent,
    OutsideClickDirective,
  ],
  exports: [
    TCBgColorDirective,
    TCBorderColorDirective,
    TCCardHeaderDirective,
    TCBorderStyleDirective,
    TCColorDirective,
    TCGradientDirective,
    TCShapeDirective,
    TCFontSizeDirective,
    TCAlignDirective,
    TCSortTableDirective,
    TCFocusDirective,
    TCListIconDirective,
    TCListAvatarDirective,
    TCListLineDirective,
    TCListImageSizeDirective,

    TCButtonComponent,
    TCCardComponent,
    TCInputComponent,
    TCTextareaComponent,
    TCFormDescriptionComponent,
    TCFormGroupComponent,
    TCFormLabelComponent,
    TCCheckboxComponent,
    TCContactComponent,
    TCSwitcherComponent,
    TCAutocompleteComponent,
    TCAutocompleteMdsComponent,
    TCRadioComponent,
    TCRadioOptionComponent,
    TCBadgeComponent,
    TCDropdownComponent,
    TCDropdownButtonComponent,
    TCDropdownContentComponent,
    TCIconComponent,
    TCVTimelineComponent,
    TCSelectComponent,
    TCAlertComponent,
    TCRatingComponent,
    TCAvatarComponent,
    TCColorPickerComponent,
    TCPickerComponent,
    TCModalComponent,
    TCListComponent,
    TCListItemComponent,
    TCProgressComponent,
    TCCircleProgressComponent,
    TCAvatarGroupComponent,
    TCUserComponent,
    TCGroupComponent,
    TCGroupSkillsComponent,
    TCGroupEnglishComponent,
  ],
  entryComponents: [TCModalComponent],
})
export class UIModule {}
