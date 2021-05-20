import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account-component.component';

describe('AccountComponentComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let inputValue: HTMLElement | any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});