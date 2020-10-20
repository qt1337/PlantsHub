import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, fromEvent} from "rxjs";

function _window(): any {
  // return the global native browser window object
  return window;
}


@Injectable({
  providedIn: 'root'
})

export class CordovaService {

  private resume: BehaviorSubject<boolean>;

  /* Cordova fires a resume event any time the application resumes from the background.
   In order to correctly process this event within the Angular application scope,
   NgZone is used to run the event listener inside the Angular zone.*/

  constructor(private zone: NgZone) {
    this.resume = new BehaviorSubject<boolean>(null);
    const clicks = fromEvent(document, 'resume');
    clicks.subscribe(event => { //@TODO Observable
      this.zone.run(() => {
        this.onResume();
      });
    });
  }

  get cordova(): any {
    return _window().cordova;
  }

  get onCordova(): Boolean {
    return !!_window().cordova;
  }

  public onResume(): void {
    this.resume.next(true);
  }

  /* For opening extern URLs */

  public openLinkInBrowser(url: string) {
    _window().SafariViewController.isAvailable(function (available) {
      if (available) {
        _window().SafariViewController.show({
          url: url,
          barColor: '#f7f7f9',
          tintColor: '#1ca8dd',
          controlTintColor: '#1ca8dd',
        });
      } else {
        _window().cordova.InAppBrowser.open(url, '_blank');
      }
    })
  }

}
