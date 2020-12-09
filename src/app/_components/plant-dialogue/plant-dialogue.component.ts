import {Component, OnInit} from '@angular/core';
import {Plant} from '../../_models/plant';

@Component({
  selector: 'app-plant-dialogue',
  templateUrl: './plant-dialogue.component.html',
  styleUrls: ['./plant-dialogue.component.css']
})
export class PlantDialogueComponent implements OnInit {

  newPlant: Plant;

  constructor() {
  }


  ngOnInit(): void {
  }

}
