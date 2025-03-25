import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { closeUpdatecategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { selectCategoryToUpdate } from 'src/app/core/state/modal/category/modal.selector';
import { CategoryService } from 'src/app/services/category.service';
@Component({
  selector: '[category-update-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-update-modal.component.html',
  styleUrl: './category-update-modal.component.scss',
})
export class CategoryUpdateModalComponent {
  categoryForm: FormGroup;
  private currentCategoryId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly catgoryService: CategoryService,
    private readonly toastr: ToastrService,
  ) {
    // Initialize the form with structure
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Subscribe to the current MenuItem to update
    this.store.select(selectCategoryToUpdate).subscribe((category) => {
      //we  have to get the category by id form backEnd    Zero Trust Architecture !!!!!!!!!!!!
      if (category) {
        this.currentCategoryId = category.id;
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
        });
      }
    });
  }

  updateCategory(): void {
    if (this.categoryForm.valid && this.currentCategoryId) {
      this.catgoryService.updateCategory(this.currentCategoryId, this.categoryForm.value).subscribe({
        next: (category) => {
          this.closeModal();
          this.catgoryService.onCategoryUpdated(category);
          this.toastr.success('category updated successfully!');
        },
        error: (error) => this.toastr.error('Error updating category', error),
      });
    } else {
      this.categoryForm.markAllAsTouched();
      // If the form is invalid, iterate over the controls and log the errors
      Object.keys(this.categoryForm.controls).forEach((key) => {
        const control = this.categoryForm.get(key);
        const errors = control?.errors ?? {};
        Object.keys(errors).forEach((keyError) => {
          this.toastr.error(`Form Invalid - control: ${key}, Error: ${keyError}`);
        });
      });
    }
  }

  closeModal(): void {
    this.store.dispatch(closeUpdatecategoryModal());
  }
}
