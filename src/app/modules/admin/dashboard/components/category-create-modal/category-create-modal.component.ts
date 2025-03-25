import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { closeCreateCategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: '[category-create-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-create-modal.component.html',
  styleUrl: './category-create-modal.component.scss',
})
export class CategoryCreateModalComponent {
  categoryForm: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly store: Store,
    private readonly toastr: ToastrService,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {}

  createCategory(): void {
    if (this.categoryForm.valid) {
      const submissionValues = this.categoryForm.getRawValue();
      this.categoryService.createCategory(submissionValues).subscribe({
        next: (category: CategoryDTO) => {
          this.toastr.success('Category created successfully!');
          this.closeModal();
          this.resetForm();
          this.categoryService.onCategoryCreated(category);
        },
        error: (error: any) => this.toastr.error('Error creating  Category!', error),
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
    this.store.dispatch(closeCreateCategoryModal());
  }

  resetForm(): void {
    this.categoryForm.reset({
      name: '',
      description: '',
    });
  }

  /*     onUseDefaultImageChange(): void {
      this.categoryForm.get('useDefaultImage')?.valueChanges.subscribe((useDefault: boolean) => {
        if (useDefault) {
          this.categoryForm.get('imageUrl')?.setValue(this.defaultImageUrl.href);
          this.categoryForm.get('imageUrl')?.disable(); // Optionally disable to prevent edits
        } else {
          this.categoryForm.get('imageUrl')?.enable(); // Re-enable if the user unchecks
          this.categoryForm.get('imageUrl')?.setValue('');
        }
      });
    } */
}
