import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponentComponent } from './account-component.component';

describe('AccountComponentComponent', () => {
  let component: AccountComponentComponent;
  let fixture: ComponentFixture<AccountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
