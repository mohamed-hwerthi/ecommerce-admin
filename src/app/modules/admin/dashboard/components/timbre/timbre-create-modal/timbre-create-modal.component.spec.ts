import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbreCreateModalComponent } from './timbre-create-modal.component';

describe('TimbreCreateModalComponent', () => {
  let component: TimbreCreateModalComponent;
  let fixture: ComponentFixture<TimbreCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimbreCreateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimbreCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
