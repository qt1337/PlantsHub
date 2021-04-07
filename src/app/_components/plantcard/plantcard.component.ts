import {Component, Inject, Input, OnInit, Output} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PlantDialogueComponent} from '../plant-dialogue/plant-dialogue.component';
import {Plant} from '../../_models/plant';
import {SearchboxComponent} from '../searchbox/searchbox.component';
import {PlantDiaryComponent} from "../plant-diary/plant-diary.component";

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.scss']
})
export class PlantcardComponent implements OnInit {
  @Input() value: string;
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
    {name: 'book', class: 'big fill-red'},
    {name: 'trash', class: 'big fill-red'}
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

  private updatePlantFavourite(plant): void {
    plant.favourite = !plant.favourite;

    this.plantService.updatePlant(
      this.user.username,
      this.user.sessionId,
      plant
    ).subscribe(plants => {
      this.plants = plants;
    });
  }

  private deactivatePlant(plant): void {
    plant.active = !plant.active;

    this.plantService.updatePlant(
      this.user.username,
      this.user.sessionId,
      plant
    ).subscribe(plants => {
      this.plants = plants;
    });
  }

  changeFavourite(plant): void {
    this.updatePlantFavourite(plant);
  }

  deletePlant(plant): void {
    this.deactivatePlant(plant);
  }

  openEditPlantDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(PlantDiaryComponent, {panelClass: 'plant-diary-dialogue-container', data: {person: {name: 'Monstera', age: 32}}}); // @TODO This is just Mock Data TBD
  }
}

