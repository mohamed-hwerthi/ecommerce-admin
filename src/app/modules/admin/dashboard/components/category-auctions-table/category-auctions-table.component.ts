import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrService } from 'ngx-toastr';
import { interval, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { PaginatedResponseDTO } from 'src/app/core/models';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CategoryAuctionTableItemComponent } from '../category-auction-table-item/category-auction-table-item.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { openCreateCategoryModal } from 'src/app/core/state/modal/category/modal.action';

@Component({
  selector: '[category-auctions-table]',
  standalone: true,
  imports: [
    NgFor,
    AngularSvgIconModule,
    ButtonComponent,
    CategoryAuctionTableItemComponent,
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './category-auctions-table.component.html',
  styleUrl: './category-auctions-table.component.scss',
})
export class CategoryAuctionsTableComponent {
  public categories: CategoryDTO[] = [];
  public isLoading: boolean = true;
  public currentPage = 1;
  public totalPages!: number;
  public timeSinceLastUpdate$!: Observable<number>;
  public lastUpdated: Date = new Date();
  selectedItemIds: Set<number> = new Set<number>();
  public originalCategories: CategoryDTO[] = [];

  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly store: Store,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;

      this.loadCategories(this.currentPage);
    });

    this.initializeSubscriptions();
    this.initializeTimeSinceLastUpdate();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCategories(page: number, limit: number = 10): void {
    this.isLoading = true;

    this.categoryService.findAllCategoriesWithPagination(page, limit).subscribe({
      next: (response: PaginatedResponseDTO<CategoryDTO>) => {
        this.originalCategories = response.items;
        this.categories = [...this.originalCategories]; // Copy for display purposes
        this.totalPages = Math.ceil(response.totalCount / limit);
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error fetching categories:', error);
        this.isLoading = false;
      },
    });

    // Update URL query parameters
    /*   this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, category: categoryFilter, sort: priceSortDirection, default: isDefault },
      queryParamsHandling: 'merge',
    }); */
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories(this.currentPage);
  }

  openCreateModal() {
    console.log('Dispatching openCreateCatgoryModal action');
    this.store.dispatch(openCreateCategoryModal());
  }

  private initializeTimeSinceLastUpdate(): void {
    this.timeSinceLastUpdate$ = interval(60000) // Emit value every 60 seconds
      .pipe(
        startWith(0), // Start immediately upon subscription
        switchMap(() => {
          const now = new Date();
          const difference = now.getTime() - this.lastUpdated.getTime();
          return [Math.floor(difference / 60000)]; // Convert to minutes
        }),
      );
  }

  private initializeSubscriptions(): void {
    const categoryCreatedSub = this.categoryService.categortyCreated$.subscribe((category) => {
      if (category) {
        this.loadCategories(this.currentPage);
        // this.menuItems.unshift(menuItem);
      }
    });

    const categoryUpdatedSub = this.categoryService.categoryUpdated$.subscribe((updatedCategory) => {
      if (updatedCategory) {
        this.loadCategories(this.currentPage);
        // const index = this.menuItems.findIndex(menuItem => menuItem.id === updatedMenuItem.id);
        // if (index !== -1) {
        //   this.menuItems[index] = updatedMenuItem; // Update the menu item in the list
        // }
      }
    });

    const CategoryDeletedSub = this.categoryService.categoryDeleted$.subscribe((deletedCategory) => {
      this.categories = this.categories.filter((item) => item.id !== deletedCategory);
    });

    this.subscriptions.add(categoryCreatedSub);
    this.subscriptions.add(categoryUpdatedSub);
    this.subscriptions.add(CategoryDeletedSub);
  }

  isSelected(id: number): boolean {
    return this.selectedItemIds.has(id);
  }

  onToggleSelection(id: number): void {
    if (this.selectedItemIds.has(id)) {
      this.selectedItemIds.delete(id);
    } else {
      this.selectedItemIds.add(id);
    }
  }

  toggleAllSelection(): void {
    const allSelected = this.isAllSelected();
    console.log('Current selection state:', allSelected ? 'All Selected' : 'Not All Selected');

    if (allSelected) {
      console.log('Deselecting all items');
      this.selectedItemIds.clear();
    } else {
      console.log('Selecting all items');
      this.categories.forEach((item) => this.selectedItemIds.add(item.id));
    }

    console.log('Selected item IDs:', Array.from(this.selectedItemIds));
    this.cdRef.detectChanges();
  }

  isAllSelected(): boolean {
    return this.categories.length > 0 && this.categories.every((item) => this.selectedItemIds.has(item.id));
  }

  trackById(index: number, item: CategoryDTO): number {
    return item.id;
  }

  getSelectedItemIds(): number[] {
    return Array.from(this.selectedItemIds); // Converts Set<number> to number[]
  }

  // Function to delete all selected items
  /*   deleteAllCategories(): void {
    const idsToDelete = Array.from(this.selectedItemIds);
    if (idsToDelete.length === 0) {
      // No items selected, show error
      this.toastr.error('Please select at least one item to delete.');
      return;
    }

    // Items are selected, proceed with deletion
    this.categoryService.delete(idsToDelete).subscribe({
      next: () => {
        this.toastr.success('All selected items deleted successfully');
        this.selectedItemIds.clear();
        this.loadMenuItems(this.currentPage);
      },
      error: (error) => {
        this.toastr.error('Error deleting items:', error);
      },
    });
  } */
}
