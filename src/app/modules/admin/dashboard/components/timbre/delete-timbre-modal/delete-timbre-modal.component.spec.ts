import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTimbreModalComponent } from './delete-timbre-modal.component';

describe('DeleteTimbreModalComponent', () => {
  let component: DeleteTimbreModalComponent;
  let fixture: ComponentFixture<DeleteTimbreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTimbreModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTimbreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
