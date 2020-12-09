import {Component, OnInit} from '@angular/core';
import {Plant} from '../../_models/plant';
import {AuthenticationService} from '../../_services/authentication.service';
import {PlantService} from '../../_services/plant.service';

@Component({
  selector: 'app-plant-dialogue',
  templateUrl: './plant-dialogue.component.html',
  styleUrls: ['./plant-dialogue.component.css']
})
export class PlantDialogueComponent implements OnInit {

  newPlant = new Plant();

  constructor(
    private authenticationService: AuthenticationService,
    private plantService: PlantService
  ) {
  }

  addPlant(): void {
    if (!this.authenticationService.userValue) {
      return;
    }
    this.plantService.addPlant(
      this.authenticationService.userValue[0].username,
      this.authenticationService.userValue[0].sessionId,
      this.newPlant);
  }

  ngOnInit(): void {
  }

}
