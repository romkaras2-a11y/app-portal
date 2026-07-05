import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormComponent } from './app-form.component';

describe('AppFormComponent', () => {
  let component: AppFormComponent;
  let fixture: ComponentFixture<AppFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
