import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAuctionsTableComponent } from './category-auctions-table.component';

describe('CategoryAuctionsTableComponent', () => {
  let component: CategoryAuctionsTableComponent;
  let fixture: ComponentFixture<CategoryAuctionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAuctionsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryAuctionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
