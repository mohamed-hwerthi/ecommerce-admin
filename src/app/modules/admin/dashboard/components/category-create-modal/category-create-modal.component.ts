import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { closeCreateCategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { CategoryService } from 'src/app/services/category.service';
import { MediaService } from '../../../layout/services/media.service';
import { Media } from 'src/app/core/models/media.model';

@Component({
  selector: '[category-create-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DropdownModule, MultiSelectModule, FileUploadModule],
  templateUrl: './category-create-modal.component.html',
  styleUrl: './category-create-modal.component.scss',
})
export class CategoryCreateModalComponent {
  categoryForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly store: Store,
    private readonly toastr: ToastrService,
    private readonly mediaService: MediaService,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  onFileSelected(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  ngOnInit() {}

  createCategory(): void {
    if (!this.categoryForm.valid) {
      this.showFormErrors();
      return;
    }

    const submissionValues = this.categoryForm.getRawValue();

    if (this.selectedFile) {
      this.uploadCategoryImageAndSaveCategory(submissionValues, this.selectedFile);
    } else {
      this.createCategoryDirectly(submissionValues);
    }
  }

  private showFormErrors(): void {
    this.categoryForm.markAllAsTouched();

    Object.entries(this.categoryForm.controls).forEach(([key, control]) => {
      if (control.errors) {
        Object.keys(control.errors).forEach((keyError) => {
          this.toastr.error(`Form Invalid - Control: ${key}, Error: ${keyError}`);
        });
      }
    });
  }

  private uploadCategoryImageAndSaveCategory(submissionValues: any, file: File): void {
    this.mediaService.uploadFile(file).subscribe({
      next: (media: Media) => {
        submissionValues.medias = [media];
        this.createCategoryDirectly(submissionValues);
      },
      error: (error: any) => this.toastr.error('Error uploading media file!', error?.message || 'Unknown error'),
    });
  }
  private createCategoryDirectly(submissionValues: any): void {
    this.categoryService.createCategory(submissionValues).subscribe({
      next: (category: CategoryDTO) => {
        this.toastr.success('Category created successfully!');
        this.closeModal();
        this.resetForm();
        this.categoryService.onCategoryCreated(category);
      },
      error: (error: any) => this.toastr.error('Error creating  Category!', error),
    });
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
