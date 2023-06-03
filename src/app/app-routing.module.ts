import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { CasetaListComponent } from './components/caseta-list/caseta-list.component';
import { CasetaComponent } from './components/caseta/caseta.component';
import { CasetaUserComponent } from './components/caseta-user/caseta-user.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/' },
  { path: '', component: HomeComponent},
  { path: 'caseta-list', component: CasetaListComponent, canActivate:[MsalGuard]},
  { path: 'caseta-user', component: CasetaUserComponent, canActivate:[MsalGuard]},
  { path: 'caseta', component: CasetaComponent, canActivate:[MsalGuard]},
  //{ path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
      {
        initialNavigation: 'enabled',
      }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
