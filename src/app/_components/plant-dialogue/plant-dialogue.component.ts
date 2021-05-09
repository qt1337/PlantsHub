import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {Plant} from '../../_models/plant';
import {AuthenticationService} from '../../_services/authentication.service';
import {PlantService} from '../../_services/plant.service';
import {PlantFormField} from '../../_models/plantFormField';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-plant-dialogue',
  templateUrl: './plant-dialogue.component.html',
  styleUrls: ['./plant-dialogue.component.scss']
})
export class PlantDialogueComponent implements OnInit {

  @Input() plant: Plant;
  plantDialogueTitle: string;
  isUpdatingDialogue : boolean;
  form : FormGroup;
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
      plantName: this.data ? this.data.plantName : "",
      family : this.data ? this.data.family : "",
      wateringInterval : this.data ? this.data.wateringInterval : "",
      fertilizingInterval : this.data ? this.data.fertilizingInterval : '',
    })


    console.log(this.data);
    this.setIsUpdatingDialogue(this.data.isUpdatingDialogue);
    this.setPlantDialogueTitle(this.data.isUpdatingDialogue);
    this.setPlantDialogueActionButtonText(this.data.isUpdatingDialogue);
  }

  submit(form) {
    this.dialogRef.close(`${form.value.plantName}`);
  }

  setPlantName() {
    this.plantName = this.data.plantName;
  }

  setIsUpdatingDialogue(isUpdatingDialogue : boolean) : void {
    this.isUpdatingDialogue = isUpdatingDialogue;
  }

  setPlantDialogueTitle(isUpdatingDialogue) {
    isUpdatingDialogue ? (this.plantDialogueTitle = 'Update PlantInfo') : (this.plantDialogueTitle = 'Add Plant');
  }

  setPlantDialogueActionButtonText(isUpdatingDialogue) {
    isUpdatingDialogue ? (this.plantDialogueButton = 'Update Plant') : (this.plantDialogueButton = 'Add Plant');

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
