import {Component, OnInit} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PlantDialogueComponent} from '../plant-dialogue/plant-dialogue.component';

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.scss']
})
export class PlantcardComponent implements OnInit {

  user: User;
  plants: any;

  constructor(
    private plantService: PlantService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.authenticationService.checkForInactiveSession();
    if (this.authenticationService.userValue) {
      this.user = this.authenticationService.userValue[0];
    } else {
    }
  }

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

  openDialog(): void {
    const dialogRef = this.dialog.open(PlantDialogueComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.getPlants();
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
