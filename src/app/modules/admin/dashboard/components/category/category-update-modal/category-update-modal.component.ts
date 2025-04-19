import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { FileUploadModule } from 'primeng/fileupload';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { Media } from 'src/app/core/models/media.model';
import { closeUpdatecategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { selectCategoryToUpdate } from 'src/app/core/state/modal/category/modal.selector';
import { MediaService } from 'src/app/modules/admin/layout/services/media.service';
import { CategoryService } from 'src/app/services/category.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: '[category-update-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FileUploadModule],
  templateUrl: './category-update-modal.component.html',
  styleUrl: './category-update-modal.component.scss',
})
export class CategoryUpdateModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  categoryForm: FormGroup;
  private currentCategoryId: number | null = null;
  selectedFile: File | null = null;
  imagePreviewUrl: SafeUrl | null = null;
  private existingMedia: Media[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly catgoryService: CategoryService,
    private readonly toastr: ToastrService,
    private readonly mediaService: MediaService,
    private readonly sanitizer: DomSanitizer,
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
        this.existingMedia = category.medias || [];

        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(this.getMenuItemImage(category));
      }
    });
  }
  getMenuItemImage(cateogry: CategoryDTO): string {
    if (cateogry.medias.length > 0) {
      return environment.apiStaticUrl + cateogry.medias[0].url;
    } else {
      return '';
    }
  }

  handelCategoryUpdating() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;

      if (this.selectedFile) {
        this.uploadCategoryImageAndSaveCategory(formValue, this.selectedFile);
      } else {
        formValue.medias = this.existingMedia;
        this.updateCategoryDirectly(formValue);
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
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.generateImagePreview(file);
    }
  }

  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(file);
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
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.categoryForm.get('media')?.setValue(''); /* todo : a voir quel est  son role */
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
