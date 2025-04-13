import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbreAuctionItemTableComponent } from './timbre-auction-item-table.component';

describe('TimbreAuctionItemTableComponent', () => {
  let component: TimbreAuctionItemTableComponent;
  let fixture: ComponentFixture<TimbreAuctionItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimbreAuctionItemTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimbreAuctionItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
