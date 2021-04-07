import {Component, Inject, Input, OnInit} from '@angular/core';
import {PlantService} from "../../_services/plant.service";
import {PlantDialogueComponent} from "../plant-dialogue/plant-dialogue.component";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-plant-diary',
  templateUrl: './plant-diary.component.html',
  styleUrls: ['./plant-diary.component.scss']
})
export class PlantDiaryComponent implements OnInit {

  @Input() plantFields;

  constructor(@Inject(MAT_DIALOG_DATA) public data
  ) {

  }

  ngOnInit(): void {
  }

}
