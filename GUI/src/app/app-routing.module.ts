import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {AddEventComponent} from "./events/add-event/add-event.component";
import {EventPageComponent} from "./events/event-page/event-page.component";
import {EventBrowserComponent} from "./events/event-browser/event-browser.component";
import {EditEventComponent} from "./events/edit-event/edit-event.component";
import {MyEventsComponent} from "./events/my-events/my-events.component";
import {EditProfileComponent} from "./profile/edit-profile/edit-profile.component";
import {NotFoundComponent} from "./_helpers/not-found/not-found.component";
import {NotAllowedComponent} from "./_helpers/not-allowed/not-allowed.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile/:id', component: ProfileComponent},
  {path: 'add-event', component: AddEventComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'event/:id', component: EventPageComponent},
  {path: 'events', component: EventBrowserComponent},
  {path: 'event/:id/edit', component: EditEventComponent},
  {path: 'my-events', component: MyEventsComponent},
  {path: 'profile/:id/edit', component: EditProfileComponent},
  {path: 'notfound', component: NotFoundComponent},
  {path: 'notallowed', component: NotAllowedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
