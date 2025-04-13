import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbreAuctionTableComponent } from './timbre-auction-table.component';

describe('TimbreAuctionTableComponent', () => {
  let component: TimbreAuctionTableComponent;
  let fixture: ComponentFixture<TimbreAuctionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimbreAuctionTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimbreAuctionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
