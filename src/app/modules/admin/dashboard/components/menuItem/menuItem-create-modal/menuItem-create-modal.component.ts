import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { MediaService } from 'src/app/modules/admin/layout/services/media.service';
import { CategoryService } from 'src/app/services/category.service';
import { MenuItem } from '../../../../../../core/models';
import { closeCreateMenuItemModal } from '../../../../../../core/state/modal/menuItem/modal.actions';
import { MenuItemsService } from '../../../../../../services/menuItems.service';
import { Media } from 'src/app/core/models/media.model';




@Component({
  selector: '[menuItem-create-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , DropdownModule ,MultiSelectModule , FileUploadModule],
  providers:   [MessageService],

  templateUrl: './menuItem-create-modal.component.html',
})
export class MenuItemCreateModalComponent {
  menuItemForm: FormGroup;
  allCategories: CategoryDTO[] = [];
  selectedFile: File | null = null;

  defaultImageUrl: URL = new URL(
    'https://w0.peakpx.com/wallpaper/97/150/HD-wallpaper-mcdonalds-double-cheese-burger-double-mcdonalds-cheese-burger-thumbnail.jpg',
  );
  trackByFn(index: number, item: { id: string; name: string }): string {
    return item.id; // Tracks by unique category ID
  }
  constructor(
    private readonly fb: FormBuilder,
    private readonly menuItemsService: MenuItemsService,
    private readonly store: Store,
    private readonly toastr: ToastrService,
    private readonly categoryService: CategoryService,
    private  readonly  messageService: MessageService  , 
    private readonly mediaService  :MediaService
  ) {
    this.menuItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [1, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      imageUrl: [''],
      barCode: [''],
      categories: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.onUseDefaultImageChange(); // Setup listener for the checkbox
  }

  // Function to handle form submission
  createMenuItem(): void {
    if (!this.menuItemForm.valid) {
      this.showFormErrors();
      return;
    }
  
    const submissionValues = this.menuItemForm.getRawValue();
  
    if (this.selectedFile) {

      this.uploadMediaAndCreateMenuItem(submissionValues, this.selectedFile);
    } else {
      this.createMenuItemDirectly(submissionValues);
    }
  }
  
  /**
   * Handles direct menu item creation when no file is selected.
   */
  private createMenuItemDirectly(submissionValues: any): void {
    this.menuItemsService.createMenuItem(submissionValues).subscribe({
      next: (menuItem: MenuItem) => this.handleSuccess(menuItem),
      error: (error: any) => this.toastr.error('Error creating menu item!', error?.message || 'Unknown error'),
    });
  }
  
  /**
   * Handles media upload then creates the menu item with the uploaded media ID.
   */
  private uploadMediaAndCreateMenuItem(submissionValues: any, file: File): void {
    this.mediaService.uploadFile(file).subscribe({
      next: (media: Media) => {
        submissionValues.medias =  [media]; 
        this.createMenuItemDirectly(submissionValues);
      },
      error: (error: any) => this.toastr.error('Error uploading media file!', error?.message || 'Unknown error'),
    });
  }
  
  /**
   * Handles success response after menu item is created.
   */
  private handleSuccess(menuItem: MenuItem): void {
    this.toastr.success('Menu Item created successfully!');
    this.closeModal();
    this.resetForm();
    this.menuItemsService.menuItemCreated(menuItem); // Notify table or other listeners
  }
  
  /**
   * Marks all form fields and shows validation errors using toastr.
   */
  private showFormErrors(): void {
    this.menuItemForm.markAllAsTouched();
  
    Object.entries(this.menuItemForm.controls).forEach(([key, control]) => {
      if (control.errors) {
        Object.keys(control.errors).forEach((keyError) => {
          this.toastr.error(`Form Invalid - Control: ${key}, Error: ${keyError}`);
        });
      }
    });
  }
  
  

  onFileSelected(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }


  closeModal(): void {
    this.store.dispatch(closeCreateMenuItemModal());
  }

  resetForm(): void {
    this.menuItemForm.reset({
      title: '',
      description: '',
      price: 1,
      imageUrl: '',
    });
  }

  onUseDefaultImageChange(): void {
    this.menuItemForm.get('useDefaultImage')?.valueChanges.subscribe((useDefault: boolean) => {
      if (useDefault) {
        this.menuItemForm.get('imageUrl')?.setValue(this.defaultImageUrl.href);
        this.menuItemForm.get('imageUrl')?.disable(); // Optionally disable to prevent edits
      } else {
        this.menuItemForm.get('imageUrl')?.enable(); // Re-enable if the user unchecks
        this.menuItemForm.get('imageUrl')?.setValue('');
      }
    });
  }
  loadCategories(): void {
    this.categoryService.findAllCategories().subscribe({
      next: (res: CategoryDTO[]) => {
        this.allCategories = res;
      },
      error: (error) => {
        this.toastr.error('Error fetching categories:', error);
      },
    });

    // Update URL query parameters
    /*   this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page, category: categoryFilter, sort: priceSortDirection, default: isDefault },
        queryParamsHandling: 'merge',
      }); */
  }
}
