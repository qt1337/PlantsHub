import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppComponent} from './app.component';
import {SignInComponent} from './_components/sign-in/sign-in.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SignUpComponent} from './_components/sign-up/sign-up.component';
import {HomeComponent} from './_components/home/home.component';
import {PageNotFoundComponent} from './_components/page-not-found/page-not-found.component';
import { PlantcardComponent } from './_components/plantcard/plantcard.component';
import {IconsModule} from './_modules/icons/icons.module';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    PageNotFoundComponent,
    PlantcardComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
  ],
  providers: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
