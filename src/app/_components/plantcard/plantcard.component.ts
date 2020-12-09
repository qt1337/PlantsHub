import {Component, OnInit} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.css']
})
export class PlantcardComponent implements OnInit {

  user: User;

  constructor(
    private plantService: PlantService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.authenticationService.checkForInactiveSession();
    if (this.authenticationService.userValue) {
      this.user = this.authenticationService.userValue[0];
    } else {
      this.router.navigate(['/signin']);
    }
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
        this.user.username,
        this.user.sessionId
      )
      .subscribe(plants => {
        this.plants = plants;
      });
  }

  updatePlantFavourite(plant): void {
    this.plantService.updatePlantFavourite(
      this.user.username,
      this.user.sessionId,
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