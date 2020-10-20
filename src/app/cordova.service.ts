import { Injectable,NgZone } from '@angular/core';
import {BehaviorSubject, fromEvent} from "rxjs";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import { Observable, of, Subject, Subscription } from 'rxjs';
import {RouterModule} from "@angular/router";

function _window(): any {
  // return the global native browser window object
  return window;
}




@Injectable(/* {
 providedIn: 'root'
}*/)



export class CordovaService {

  private resume: BehaviorSubject<boolean>;

  constructor(private zone: NgZone) {
    this.resume = new BehaviorSubject<boolean>(null);
    fromEvent(document, 'resume').subscribe(event => { //@TODO Observable
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

  public openLinkInBrowser(url: string) {
    _window().SafariViewController.isAvailable(function(available) {
      if (available) {
        _window().SafariViewController.show({
          url: url,
          barColor: '#f7f7f9',
        tintColor: '#1ca8dd',
        controlTintColor: '#1ca8dd',
      });
      } else {
        _window().cordova.InAppBrowser.open(url,'_blank');
      }
    })
  }

}
