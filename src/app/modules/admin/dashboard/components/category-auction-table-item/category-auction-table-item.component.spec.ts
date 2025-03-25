import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAuctionTableItemComponent } from './category-auction-table-item.component';

describe('CategoryAuctionTableItemComponent', () => {
  let component: CategoryAuctionTableItemComponent;
  let fixture: ComponentFixture<CategoryAuctionTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAuctionTableItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryAuctionTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
