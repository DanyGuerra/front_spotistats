import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/common/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { PagenotfoundComponent } from './components/common/pagenotfound/pagenotfound.component';
import { LoginErrorComponent } from './components/login-error/login-error.component';
import { ButtonModule } from 'primeng/button';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HomeAnimationComponent } from './components/common/home-animation/home-animation.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { LoadingComponent } from './components/common/loading/loading.component';

// jsons for ngx-translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, PagenotfoundComponent, LoginErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    FooterComponent,
    BrowserAnimationsModule,
    HttpClientModule,
    ButtonModule,
    ToastModule,
    LoadingComponent,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    HomeAnimationComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
