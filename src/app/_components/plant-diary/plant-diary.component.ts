import {Component, Inject, Input, OnInit, ViewEncapsulation} from '@angular/core';

import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-plant-diary',
  templateUrl: './plant-diary.component.html',
  styleUrls: ['./plant-diary.component.scss'],
  encapsulation: ViewEncapsulation.None // To Remove Default Styling of the Dialog Component
})
export class PlantDiaryComponent implements OnInit {

  @Input() plantFields;

  constructor(@Inject(MAT_DIALOG_DATA) public data
  ) {

  }

  ngOnInit(): void {
  }

}
