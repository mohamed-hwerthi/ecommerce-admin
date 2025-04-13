import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { closeUpdateMenuItemModal } from '../../../../../../core/state/modal/menuItem/modal.actions';
import { selectMenuItemToUpdate } from '../../../../../../core/state/modal/menuItem/modal.selectors';
import { MenuItemsService } from '../../../../../../services/menuItems.service';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { MediaService } from 'src/app/modules/admin/layout/services/media.service';
import { Media } from 'src/app/core/models/media.model';
import { MenuItem } from 'src/app/core/models';
import { CurrencyService } from 'src/app/services/currency.service';
import { CurrencyDTO } from 'src/app/core/models/currency.model';

import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SafeUrl } from '@angular/platform-browser';
import { Tax } from 'src/app/core/models/tax.model';

@Component({
  selector: '[menuItem-update-modal]',
  templateUrl: './menuItem-update-modal.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DropdownModule, MultiSelectModule, FileUploadModule],
})
export class MenuItemUpdateModalComponent implements OnInit {
  menuItemForm: FormGroup;
  // menuItems$: Observable<MenuItem[]>;
  private currentMenuItemId: number | null = null;
  allCategories: CategoryDTO[] = [];
  selectedFile: File | null = null;
  allCurrencies: CurrencyDTO[] = [];
  imagePreviewUrl: SafeUrl | null = null;
  tax:Tax | null =null;
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly menuItemsService: MenuItemsService,
    private readonly toastr: ToastrService,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
    private readonly currencyService:CurrencyService,
    

  ) {
    // Initialize the form with structure
    this.menuItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [1, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      tva: [0, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      categories: [null, Validators.required],
      barCode: [''],
      currency: [null, Validators.required],

    });

    // this.menuItems$ = this.menuItemsService.getAllMenuItems();
  }

  ngOnInit(): void {
    this.loadCurrencies();
    this.loadCategories();
    this.store.select(selectMenuItemToUpdate).subscribe((menuItem) => {
      if (menuItem) {
        console.log(menuItem)
        this.currentMenuItemId = menuItem.id;
        this.tax=menuItem?.tax
        this.menuItemForm.patchValue({
          title: menuItem.title,
          description: menuItem.description,
          price: menuItem.price,
          currency: menuItem.currency,
          tva: menuItem?.tax?.rate,
          categories: menuItem.categories,
          barCode: menuItem.barCode,
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

  handelMenuItemUpdating() {
    if (this.menuItemForm.valid) {
      if (this.selectedFile) {
        this.uploadMediaAndUpdateMenuItem();
      } else {
        const submissionValues = this.menuItemForm.getRawValue();
       
    // Prepare tax object
    const taxPayload = this.tax 
      ? { ...this.tax, rate: submissionValues.tva } // Update existing tax
      : { rate: submissionValues.tva 
        , name: 'TVA' // Or any default name you prefer
      }; // Create new tax if none exists

    const payload = {
      ...submissionValues,
      tax: taxPayload
    };
      console.log(payload)
         
        this.updateMenuItem(payload);
      }
    } else {
      this.menuItemForm.markAllAsTouched();
    }
  }

  private uploadMediaAndUpdateMenuItem(): void {
    if (this.selectedFile) {
      this.mediaService.uploadFile(this.selectedFile).subscribe({
        next: (media: Media) => {
          const submissionValues = this.menuItemForm.getRawValue();
          submissionValues.medias = [media];
          this.updateMenuItem(submissionValues);
        },
        error: (error: any) => this.toastr.error('Error uploading media file!', error?.message || 'Unknown error'),
      });
    }
  }
  updateMenuItem(subbsmissionValue: MenuItem): void {
    if (this.currentMenuItemId) {
      this.menuItemsService.updateMenuItem(this.currentMenuItemId, subbsmissionValue).subscribe({
        next: (MenuItem) => {
          this.closeModal();
          this.menuItemsService.menuItemUpdated(MenuItem);
          this.toastr.success('Menu item updated successfully!');
        },
        error: (error) => this.toastr.error('Error updating menu item', error),
      });
    } else {
      // If the form i invalid, iterate over the controls and log the errors
    }
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
  }
  closeModal(): void {
    this.store.dispatch(closeUpdateMenuItemModal());
  }

  loadCurrencies(): void {
    this.currencyService.findAllCurrencies().subscribe({
      next: (res: CurrencyDTO[]) => {
        console.log(res);
        this.allCurrencies = res;
      },
      error: (error) => {
        this.toastr.error('Error fetching categories:', error);
      },
    });

  }
}
