import {Component, OnInit} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.css']
})
export class PlantcardComponent implements OnInit {

  constructor(
    private plantService: PlantService,
    private authenticationService: AuthenticationService,
  ) {
  }

  plants: any;

  icons = [
    {name: 'heart', class: 'big fill-red'},
    {name: 'book', class: 'big fill-red'}

  ];

  ngOnInit(): void {
    this.getPlants();
  }

  getPlants(): void {
    if (!this.authenticationService.userValue) {
      return;
    }
    this.plantService
      .getPlants(
        this.authenticationService.userValue[0].username,
        this.authenticationService.userValue[0].sessionId
      )
      .subscribe(plants => {
        this.plants = plants;
      });
  }

  updatePlantFavourite(plant): void {

    this.plantService.updatePlantFavourite(
      this.authenticationService.userValue[0].username,
      this.authenticationService.userValue[0].sessionId,
      plant.plantId,
      !plant.favourite
    ).subscribe(plants => {
      this.plants = plants;
    });
  }

  clickEvent(plant): void {
    this.updatePlantFavourite(plant);
  }
}
