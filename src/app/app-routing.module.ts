import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './components/common/pagenotfound/pagenotfound.component';
import { authGuard } from './guards/auth.guard';
import { LoginErrorComponent } from './components/login-error/login-error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login-error', component: LoginErrorComponent },
  {
    path: ':usernameid',
    loadComponent: () =>
      import('./components/user-profile/user-profile.component').then(
        (m) => m.UserprofileComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
