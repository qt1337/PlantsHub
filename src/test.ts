// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { RouterTestingModule } from '@angular/router/testing';
import 'zone.js/dist/zone-testing';
import {async, getTestBed, TestBed} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import {AppComponent} from './app/app.component';

beforeEach(async(() => {
  TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [ AppComponent ]
  })
    .compileComponents();
}));


declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
