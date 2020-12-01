import { Component, OnInit } from '@angular/core';
import {PLANTS} from "./plants";

@Component({
  selector: 'app-plantcard',
  templateUrl: './plantcard.component.html',
  styleUrls: ['./plantcard.component.css']
})
export class PlantcardComponent implements OnInit {

  plants = PLANTS;
  constructor() { }

  ngOnInit(): void {
  }

}
