import {Component, Inject, Input, OnInit} from '@angular/core';
import {Plant} from '../../_models/plant';
import {AuthenticationService} from '../../_services/authentication.service';
import {PlantService} from '../../_services/plant.service';
import {PlantFormField} from '../../_models/plantFormField';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-plant-dialogue',
  templateUrl: './plant-dialogue.component.html',
  styleUrls: ['./plant-dialogue.component.scss']
})
export class PlantDialogueComponent {

  @Input() selectedPlant: Plant;
  plantDialogueTitle: string = 'Add a new member to your Plant-Family';

  plantFormFields: PlantFormField[] = [
    {
      title: 'Plant Family',
      name: 'family',
      defaultValue: ''
    },
    {
      title: 'Plant Name',
      name: 'plantName',
      defaultValue: ''
    },
    {
      title: 'Watering Interval',
      name: 'wateringInterval',
      defaultValue: 0
    },
    {
      title: 'Fertilizing Interval',
      name: 'fertilizingInterval',
      defaultValue: 0
    },
  ];

  plantImage: File = null;
  newPlant = new Plant();
  plants: Plant[];

  constructor(
    private authenticationService: AuthenticationService,
    private plantService: PlantService,
    private dialogRef: MatDialogRef<PlantDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private data

  ) {
  }

  addPlant(): void {
    if (!this.authenticationService.userValue) {
      return;
    }
    const fd = new FormData();
    if (this.plantImage) {
      fd.append('plantImage', this.plantImage, this.plantImage.name);
    }
    this.plantService.addPlant(
      this.authenticationService.userValue[0].username,
      this.authenticationService.userValue[0].sessionId,
      this.newPlant,
      fd
    )
      .subscribe(plants => {
        this.plants = plants;
      });
  }

  onFileSelected(event): void {
    this.plantImage = event.target.files[0];
    console.log(this.plantImage);
  }

}
