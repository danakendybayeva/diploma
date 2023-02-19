import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { ROUTES, RoutingModule } from './routing/routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PagesModule } from './pages/pages.module';
import { UIModule } from './ui/ui.module';

import { pageDataReducer } from './store/reducers/page-data.reducer';
import { appSettingsReducer } from './store/reducers/app-settings.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NzTableModule,  } from 'ng-zorro-antd/table';
import {NZ_I18N, en_US, ru_RU} from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import ru from '@angular/common/locales/ru';
import { JwtInterceptor } from './user/_helpers/jwt.interceptor';
import { ErrorInterceptor } from './user/_helpers/error.interceptor';

import { ToastrModule } from 'ngx-toastr';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AuthenticationService} from './user/_services/authentication.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { KatexModule } from 'ng-katex';
// import { AppComponent } from './app/app.component';

registerLocaleData(ru);
registerLocaleData(en);

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      preloadingStrategy: PreloadAllModules
    }),
    StoreModule.forRoot({
      pageData: pageDataReducer,
      appSettings: appSettingsReducer,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      useDefaultLang: false,
    }),
    RoutingModule,
    PagesModule,
    UIModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    NzTableModule,
    FormsModule,
    ToastrModule.forRoot(),
    IvyCarouselModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    KatexModule
  ],
  providers: [
      { provide: NZ_I18N, useValue: ru_RU },
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
