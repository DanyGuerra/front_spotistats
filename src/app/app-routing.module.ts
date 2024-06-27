import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './components/common/pagenotfound/pagenotfound.component';
import { authGuard } from './guards/auth.guard';
import { LoginErrorComponent } from './components/login-error/login-error.component';
import { authResolver } from './resolvers/auth.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login-error', component: LoginErrorComponent },
  {
    path: ':usernameid',
    component: UserprofileComponent,
    canActivate: [authGuard],
    resolve: {
      authData: authResolver,
    },
  },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
