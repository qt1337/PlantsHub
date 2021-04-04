import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent  {
  // Die Pflanze die gesucht wird
  @Output() searchValue = new EventEmitter();
  searchString = '';

  constructor() { }

}
