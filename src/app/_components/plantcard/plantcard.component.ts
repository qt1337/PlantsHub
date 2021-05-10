import {Component, Input, OnInit} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {PlantDialogueComponent} from '../plant-dialogue/plant-dialogue.component';
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

  openDialog(isUpdatingDialogue : boolean, plant? : Plant): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      isUpdatingDialogue: isUpdatingDialogue,
      plantId : plant ? plant.plantId : "",
      plantName : plant ? plant.plantName : "",
      family : plant ? plant.family : "",
      wateringInterval : plant ? plant.wateringInterval : "",
      fertilizingInterval : plant ? plant.fertilizingInterval : "",
      plantBirthday : plant ? plant.plantBirthday : "5/21/2021",
      active : plant ? plant.active : true,
      favourite : plant ? plant.favourite : 0

    }
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

  changeFavourite(plant): void {
    this.updatePlantFavourite(plant);
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

  deletePlant(plant): void {
    this.deactivatePlant(plant);
  }

}
