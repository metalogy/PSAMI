import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GoogleMapsModule} from '@angular/google-maps';
import {AddEventComponent} from './events/add-event/add-event.component'
import {MatRadioModule} from "@angular/material/radio";
import {EventPageComponent} from './events/event-page/event-page.component';
import {MatTableModule} from "@angular/material/table";
import {EventBrowserComponent} from './events/event-browser/event-browser.component';
import {DatePipe} from "@angular/common";
import { EditEventComponent } from './events/edit-event/edit-event.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { MyEventsComponent } from './events/my-events/my-events.component';
import {MatSelectModule} from "@angular/material/select";
import { NotFoundComponent } from './_helpers/not-found/not-found.component';
import { NotAllowedComponent } from './_helpers/not-allowed/not-allowed.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    AddEventComponent,
    EventPageComponent,
    EventBrowserComponent,
    EditEventComponent,
    EditProfileComponent,
    MyEventsComponent,
    NotFoundComponent,
    NotAllowedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatTableModule,
    MatSelectModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    authInterceptorProviders,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
