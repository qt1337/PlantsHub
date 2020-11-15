import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppComponent} from './app.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from './authentication.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
