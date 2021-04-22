import {Component, Input, OnInit} from '@angular/core';
import {PlantService} from '../../_services/plant.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {PlantDialogueComponent} from '../plant-dialogue/plant-dialogue.component';
import {PlantDiaryComponent} from '../plant-diary/plant-diary.component';
import {Plant} from "../../_models/plant";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.scss']
})
export class PlantcardComponent implements OnInit {
  @Input() value: string;
  selectedPlantsStuff: Plant;
  user: User;
  plants: any;
  dialogRef: MatDialogRef<PlantDialogueComponent>

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

  openDialog(plant?): void {
    const dialogRef = this.dialog.open(PlantDialogueComponent, {
      data: {
        title: plant ? plant.title : 'blob',
        name: plant ? plant.name : '',
        defaultValue: plant? plant.defaultValue: ''
      }
    });

    this.dialogRef.afterClosed().subscribe(() => {
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
