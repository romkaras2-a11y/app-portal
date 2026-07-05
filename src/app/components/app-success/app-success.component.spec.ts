import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSuccesComponent } from './app-success.component';

describe('AppSuccessComponent', () => {
  let component: AppSuccesComponent;
  let fixture: ComponentFixture<AppSuccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSuccesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSuccesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
