import { Component } from '@angular/core';

@Component({
  selector: 'app-sortby',
  templateUrl: './sortby.component.html',
  styleUrls: ['./sortby.component.scss']
})
export class SortbyComponent {

  constructor() { }


  foods: any[] = [
    {value: 'steak-0', viewValue: 'Name'},
    {value: 'pizza-1', viewValue: 'Added Date'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}
