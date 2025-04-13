import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbreComponent } from './timbre.component';

describe('TimbreComponent', () => {
  let component: TimbreComponent;
  let fixture: ComponentFixture<TimbreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimbreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimbreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
