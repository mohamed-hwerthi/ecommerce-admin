import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FileUploadModule } from 'primeng/fileupload';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { Media } from 'src/app/core/models/media.model';
import { closeUpdatecategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { selectCategoryToUpdate } from 'src/app/core/state/modal/category/modal.selector';
import { MediaService } from 'src/app/modules/admin/layout/services/media.service';
import { CategoryService } from 'src/app/services/category.service';
@Component({
  selector: '[category-update-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FileUploadModule],
  templateUrl: './category-update-modal.component.html',
  styleUrl: './category-update-modal.component.scss',
})
export class CategoryUpdateModalComponent {
  categoryForm: FormGroup;
  private currentCategoryId: number | null = null;
  selectedFile: File | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly catgoryService: CategoryService,
    private readonly toastr: ToastrService,
    private readonly mediaService: MediaService,
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

  handelCategoryUpdating() {
    if (this.categoryForm.valid) {
      if (this.selectedFile) {
        this.uploadCategoryImageAndSaveCategory(this.categoryForm.value, this.selectedFile);
      } else {
        this.updateCategoryDirectly(this.categoryForm.value);
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  updateCategoryDirectly(submissionValue: CategoryDTO): void {
    if (this.currentCategoryId) {
      this.catgoryService.updateCategory(this.currentCategoryId, submissionValue).subscribe({
        next: (category) => {
          this.closeModal();
          this.catgoryService.onCategoryUpdated(category);
          this.toastr.success('category updated successfully!');
        },
        error: (error) => this.toastr.error('Error updating category', error),
      });
    }
  }

  closeModal(): void {
    this.store.dispatch(closeUpdatecategoryModal());
  }
  onFileSelected(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  private uploadCategoryImageAndSaveCategory(submissionValues: any, file: File): void {
    this.mediaService.uploadFile(file).subscribe({
      next: (media: Media) => {
        submissionValues.medias = [media];
        this.updateCategoryDirectly(submissionValues);
      },
      error: (error: any) => this.toastr.error('Error uploading media file!', error?.message || 'Unknown error'),
    });
  }
}
