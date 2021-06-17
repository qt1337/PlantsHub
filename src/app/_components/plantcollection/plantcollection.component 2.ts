import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-plantcollection',
  templateUrl: './plantcollection.component.html',
  styleUrls: ['./plantcollection.component.scss']
})
export class PlantcollectionComponent implements OnInit {

  value: string;

  valueChangeEvent($event): void{
    this.value = $event;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  setValue($event): void { // @TODO Why is this not working simultaniously?
    console.log($event);
    this.value = $event;
  }
}
