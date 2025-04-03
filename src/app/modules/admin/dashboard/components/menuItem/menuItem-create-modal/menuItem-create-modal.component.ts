import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../../../core/models';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuItemsService } from '../../../../../../services/menuItems.service';
import { closeCreateMenuItemModal } from '../../../../../../core/state/modal/menuItem/modal.actions';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryDTO } from 'src/app/core/models/category.model';

@Component({
  selector: '[menuItem-create-modal]',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './menuItem-create-modal.component.html',
})
export class MenuItemCreateModalComponent {
  menuItemForm: FormGroup;
  allCategories: CategoryDTO[] = [];
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
  ) {
    this.menuItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [1, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      imageUrl: [''],
      barCode: [''],
      categoriesIds: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.onUseDefaultImageChange(); // Setup listener for the checkbox
  }

  // Function to handle form submission
  createMenuItem(): void {
    console.log(this.menuItemForm.value);
    if (this.menuItemForm.valid) {
      this.menuItemForm.get('imageUrl')?.enable();
      const submissionValues = this.menuItemForm.getRawValue();

      console.log(submissionValues);
      delete submissionValues.useDefaultImage; // removing boolean from submit values
      this.menuItemsService.createMenuItem(submissionValues).subscribe({
        next: (MenuItem: MenuItem) => {
          this.toastr.success('Menu Item created successfully!');
          this.closeModal();
          this.resetForm(); // Reset form to default state after creation
          this.menuItemsService.menuItemCreated(MenuItem); // Notify about the new MenuItem !!! VERY IMPORTANT- REFETCH THE TABLE
        },
        error: (error: any) => this.toastr.error('Error creating menu item!', error),
      });
    } else {
      this.menuItemForm.markAllAsTouched();
      // If the form is invalid, iterate over the controls and log the errors
      Object.keys(this.menuItemForm.controls).forEach((key) => {
        const control = this.menuItemForm.get(key);
        const errors = control?.errors ?? {};
        Object.keys(errors).forEach((keyError) => {
          this.toastr.error(`Form Invalid - control: ${key}, Error: ${keyError}`);
        });
      });
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
