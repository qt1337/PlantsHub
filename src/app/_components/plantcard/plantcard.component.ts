import {Component, Inject, Input, OnInit} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {PlantDialogueComponent} from '../plant-dialogue/plant-dialogue.component';
import {PlantDiaryComponent} from '../plant-diary/plant-diary.component';
import {Plant} from "../../_models/plant";

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.scss']
})
export class PlantcardComponent implements OnInit {
  @Input() value: string;

  plant: Plant;
  user: User;
  plants: any;
  dialogRef: MatDialogRef<PlantDialogueComponent>
  selectedPlant: string;
  isUpdatingDialogue : boolean;

  icons = [
    {name: 'heart', class: 'big fill-red'},
    {name: 'book', class: 'big fill-red'},
    {name: 'trash', class: 'big fill-red'}
  ];

  constructor(
    private plantService: PlantService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,

    private dialog: MatDialog,

  ) {
    this.authenticationService.checkForInactiveSession();
    if (this.authenticationService.userValue) {
      this.user = this.authenticationService.userValue[0];
    } else {
    }
  }

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

  getCurrentPlant(plant) : Plant {
    return this.plants[plant];
  }

  openDialog(isUpdatingDialogue : boolean, plant? : Plant): void {


    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      isUpdatingDialogue: isUpdatingDialogue,
      plantName : plant ? plant.plantName : "",
      family : plant ? plant.family : "",
      wateringInterval : plant ? plant.wateringInterval : "",
      fertilizingInterval : plant ? plant.fertilizingInterval : ""

    }
    console.log(plant.plantName);
    dialogConfig.autoFocus = true;

    this.dialogRef = this.dialog.open(PlantDialogueComponent, dialogConfig)

    this.dialogRef
      .afterClosed()
      .subscribe(() => {
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


}
