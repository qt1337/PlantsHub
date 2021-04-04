import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppComponent} from './app.component';
import {SignInComponent} from './_components/sign-in/sign-in.component';
import {AppRoutingModule} from './app-routing.module';
import {DemoMaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SignUpComponent} from './_components/sign-up/sign-up.component';
import {HomeComponent} from './_components/home/home.component';
import {PageNotFoundComponent} from './_components/page-not-found/page-not-found.component';
import {PlantDialogueComponent} from './_components/plant-dialogue/plant-dialogue.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PlantcardComponent} from './_components/plantcard/plantcard.component';
import {FeatherModule} from 'angular-feather';
import {IconsModule} from './_modules/icons/icons.module';
import { SearchboxComponent } from './_components/searchbox/searchbox.component';
import { PlantcollectionComponent } from './_components/plantcollection/plantcollection.component';
import { SortbyComponent } from './_components/sortby/sortby.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    PageNotFoundComponent,
    PlantDialogueComponent,
    PlantcardComponent,
    SearchboxComponent,
    PlantcollectionComponent,
    SortbyComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FeatherModule,
    IconsModule,
    Ng2SearchPipeModule
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
