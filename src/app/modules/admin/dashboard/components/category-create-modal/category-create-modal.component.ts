import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  imagePreviewUrl: SafeUrl | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoryService: CategoryService,
    private readonly store: Store,
    private readonly toastr: ToastrService,
    private readonly mediaService: MediaService,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.generateImagePreview(file);
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
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.categoryForm.get('imageUrl')?.setValue('');
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      console.log(this.imagePreviewUrl);
    };
    reader.readAsDataURL(file);
  }
}
