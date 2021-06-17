import {Component, Inject, Input, OnInit} from '@angular/core';
import {Plant} from '../../_models/plant';
import {AuthenticationService} from '../../_services/authentication.service';
import {PlantService} from '../../_services/plant.service';
import {PlantFormField} from '../../_models/plantFormField';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-plant-dialogue',
  templateUrl: './plant-dialogue.component.html',
  styleUrls: ['./plant-dialogue.component.scss']
})
export class PlantDialogueComponent implements OnInit {

  @Input() plant: Plant;
  plantDialogueTitle: string;
  isUpdatingDialogue: boolean;
  form: FormGroup;
  plantName;

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
  plantDialogueButton: string;

  constructor(
    private authenticationService: AuthenticationService,
    private plantService: PlantService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PlantDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      plantId: this.data ? this.data.plantId : '',
      plantName: this.data ? this.data.plantName : '',
      family: this.data ? this.data.family : '',
      wateringInterval: this.data ? this.data.wateringInterval : 0,
      fertilizingInterval: this.data ? this.data.fertilizingInterval : 0,
      plantBirthday: this.data ? this.data.plantBirthday : '2020-12-12',
      active: this.data ? this.data.active : true,
      favourite: this.data ? this.data.favourite : false
    });

    this.setIsUpdatingDialogue(this.data.isUpdatingDialogue);
    this.setPlantDialogueTitle(this.data.isUpdatingDialogue);
    this.setPlantDialogueActionButtonText(this.data.isUpdatingDialogue);
  }

  setIsUpdatingDialogue(isUpdatingDialogue: boolean): void {
    this.isUpdatingDialogue = isUpdatingDialogue;
  }

  setPlantDialogueTitle(isUpdatingDialogue) {
    isUpdatingDialogue ? (this.plantDialogueTitle = 'Update PlantInfo') : (this.plantDialogueTitle = 'Add Plant');
  }

  setPlantDialogueActionButtonText(isUpdatingDialogue) {
    isUpdatingDialogue ? (this.plantDialogueButton = 'Update Plant') : (this.plantDialogueButton = 'Add Plant');

  }

  submitPlantDialogueInformation(): void {
    const username = this.authenticationService.userValue[0].username;
    const sessionId = this.authenticationService.userValue[0].sessionId;

    if (!this.authenticationService.userValue) {
      return;
    }

    const fd = new FormData();
    if (this.plantImage) {
      fd.append('plantImage', this.plantImage, this.plantImage.name);
    }

    if (!this.isUpdatingDialogue) {
      this.plantService.addPlant(
        username,
        sessionId,
        this.form.value,
        fd
      )
        .subscribe(plants => {
          this.plants = plants;
        });
    } else {

      this.plantService.updatePlant(
        username,
        sessionId,
        this.form.value,
      )
        .subscribe(plants => {
          this.plants = plants;
        });
    }

  }

  onFileSelected(event): void {
    this.plantImage = event.target.files[0];
    console.log(this.plantImage);
  }


}
