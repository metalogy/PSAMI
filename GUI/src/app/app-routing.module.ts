import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {AddEventComponent} from "./events/add-event/add-event.component";
import {EventPageComponent} from "./events/event-page/event-page.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile/:id', component: ProfileComponent}, //todo pathparam nie znaleziono
  {path: 'add-event', component: AddEventComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'event/:id', component: EventPageComponent}, //todo pathparam nie znaleziono
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
