import {Component, OnInit} from '@angular/core';
import {PLANTS} from './plants';

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.css']
})
export class PlantcardComponent implements OnInit {

  constructor() {
  }

  plants = PLANTS;
  icons = [
    {name: 'heart', class: 'big fill-red'},
    {name: 'book', class: 'big fill-red'}

  ];

  ngOnInit(): void {
  }

  clickEvent(plant): void {
    plant.status = !plant.status;
  }
}
