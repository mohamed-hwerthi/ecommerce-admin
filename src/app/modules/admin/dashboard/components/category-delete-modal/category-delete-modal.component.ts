import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { closeDeletecCategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { selectDeleteCategoryId } from 'src/app/core/state/modal/category/modal.selector';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: '[category-delete-modal]',
  standalone: true,
  imports: [],
  templateUrl: './category-delete-modal.component.html',
  styleUrl: './category-delete-modal.component.scss',
})
export class CategoryDeleteModalComponent {
  categoryIdToDelete: number | undefined | null = null;
  private readonly subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly categoryService: CategoryService,
    private readonly toastr: ToastrService,
  ) {
    this.subscription.add(
      this.store.select(selectDeleteCategoryId).subscribe((categoryId) => {
        this.categoryIdToDelete = categoryId;
      }),
    );
  }

  deleteCategory(): void {
    if (!this.categoryIdToDelete) {
      this.toastr.error('Category  ID to delete not provided!');
      return;
    }
    this.categoryService.deleteCategory(this.categoryIdToDelete).subscribe({
      next: () => {
        this.categoryService.onCategoryDeleted(this.categoryIdToDelete);
        this.toastr.success(
          `Category  with ID ${this.categoryIdToDelete} deletedcloseDeleteMenuItemModal successfully!`,
        );
        this.closeModal();
      },
      error: (error) => this.toastr.error('Failed to delete menu item!:', error.message),
    });
  }

  closeModal(): void {
    this.store.dispatch(closeDeletecCategoryModal());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
