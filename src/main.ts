import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

/* The Angular app should only be bootstrapped once the Cordova "deviceready" event is fired.
This ensures that all resources have been loaded and the Cordova service API is ready to be called */
const onDeviceReady = () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
};
document.addEventListener('deviceready', onDeviceReady, false);
