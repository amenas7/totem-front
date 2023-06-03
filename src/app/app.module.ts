import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

//login office 365
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { 
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent 
} from '@azure/msal-angular';

import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastrModule } from 'ngx-toastr';

import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { AzureAdService } from './servicios/azure-ad.service';
import { CasetaComponent } from './components/caseta/caseta.component';
import { CasetaListComponent } from './components/caseta-list/caseta-list.component';
import { CasetaUserComponent } from './components/caseta-user/caseta-user.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';

const isIE =
  window.navigator.userAgent.indexOf('MSIE') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

  

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CasetaComponent,
    CasetaListComponent,
    CasetaUserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ProgressSpinnerModule,
    DropdownModule,
    AutoCompleteModule,
    ToastrModule,
    MsalModule.forRoot(new PublicClientApplication
      (
        {
          auth: {
            clientId: environment.clientId,
            redirectUri: environment.redirectUrl,
            authority: environment.authority,
          },
          cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: isIE,
          }
        }),
        {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: ['user.read'],
          },
        },
        {
          interactionType: InteractionType.Redirect,
          protectedResourceMap: new Map([
            ['https://graph.microsoft.com/v1.0/me', ['user.Read']],
          ]),
        }
      )
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true,
    },
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, 
    MsalGuard, AzureAdService],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
