import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Tax } from 'src/app/core/models/tax.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[menuItem-update-modal]',
  templateUrl: './menuItem-update-modal.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DropdownModule, MultiSelectModule, FileUploadModule],
  providers: [MessageService],
})
export class MenuItemUpdateModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  menuItemForm: FormGroup;
  private currentMenuItemId: number | null = null;
  allCategories: CategoryDTO[] = [];
  allCurrencies: CurrencyDTO[] = [];
  selectedFile: File | null = null;
  imagePreviewUrl: SafeUrl | null = null;
  tax: Tax | null = null;
  originalMedia: Media | null = null; // Store the original media object

  defaultImageUrl: URL = new URL(
    'https://w0.peakpx.com/wallpaper/97/150/HD-wallpaper-mcdonalds-double-cheese-burger-double-mcdonalds-cheese-burger-thumbnail.jpg',
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly menuItemsService: MenuItemsService,
    private readonly toastr: ToastrService,
    private readonly categoryService: CategoryService,
    private readonly mediaService: MediaService,
    private readonly currencyService: CurrencyService,
    private readonly sanitizer: DomSanitizer
  ) {
    this.menuItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [1, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      tva: [0, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      imageUrl: [''],
      categories: [null, Validators.required],
      barCode: [''],
      currency: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
    this.loadCategories();
    this.store.select(selectMenuItemToUpdate).subscribe((menuItem) => {
      if (menuItem) {
        this.currentMenuItemId = menuItem.id;
        this.tax = menuItem?.tax;
        this.originalMedia = menuItem.medias?.[0] || null; // Store original media
        
        // Calculate price without tax if tax exists, otherwise use price directly
        const displayPrice = menuItem.tax?.rate
        ? parseFloat((menuItem.price / (1 + menuItem.tax.rate / 100)).toFixed(3)) // Rounds to 2 decimals
        : parseFloat(menuItem.price.toFixed(3)); // Also rounds if no tax
    
        this.menuItemForm.patchValue({
          title: menuItem.title,
          description: menuItem.description,
          price: displayPrice,  // Use the calculated price here
          currency: menuItem.currency,
          tva: menuItem?.tax?.rate,
          imageUrl: menuItem.medias?.[0]?.url || '',
          categories: menuItem.categories,
          barCode: menuItem.barCode,
        });
      }
    });
  }

  getImageUrl(): string {
    const imageUrl = this.menuItemForm.get('imageUrl')?.value;
    if (imageUrl) {
      return environment.apiStaticUrl + imageUrl;
    }
    return this.defaultImageUrl.href;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size and type
      if (file.size > 2 * 1024 * 1024) {
        this.toastr.error('File size must be less than 2MB');
        return;
      }
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        this.toastr.error('Only PNG and JPG files are allowed');
        return;
      }
      this.selectedFile = file;
      this.generateImagePreview(file);
      this.menuItemForm.get('imageUrl')?.setValue(''); // Clear existing image URL since a new file is selected
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.menuItemForm.get('imageUrl')?.setValue('');
    this.originalMedia = null; // Clear original media
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  handelMenuItemUpdating(): void {
    if (this.menuItemForm.valid) {
      const submissionValues = this.menuItemForm.getRawValue();

      // Prepare tax object
      const taxPayload = this.tax
        ? { ...this.tax, rate: submissionValues.tva }
        : { rate: submissionValues.tva, name: 'TVA' };

      const payload = {
        ...submissionValues,
        tax: taxPayload,
      };

      // Include existing media if no new file is selected and image wasn't removed
      if (!this.selectedFile && this.originalMedia && this.menuItemForm.get('imageUrl')?.value) {
        payload.medias = [this.originalMedia];
      } else if (!this.selectedFile && !this.originalMedia) {
        payload.medias = []; // No image
      }

      if (this.selectedFile) {
        this.uploadMediaAndUpdateMenuItem(payload);
      } else {
        this.updateMenuItem(payload);
      }
    } else {
      this.menuItemForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields.');
    }
  }

  private uploadMediaAndUpdateMenuItem(payload: any): void {
    if (this.selectedFile) {
      this.mediaService.uploadFile(this.selectedFile).subscribe({
        next: (media: Media) => {
          payload.medias = [media];
          this.updateMenuItem(payload);
        },
        error: (error: any) => this.toastr.error('Error uploading media file!', error?.message || 'Unknown error'),
      });
    }
  }

  updateMenuItem(submissionValue: MenuItem): void {
    if (this.currentMenuItemId) {
      this.menuItemsService.updateMenuItem(this.currentMenuItemId, submissionValue).subscribe({
        next: (menuItem) => {
          this.closeModal();
          this.menuItemsService.menuItemUpdated(menuItem);
          this.toastr.success('Menu item updated successfully!');
        },
        error: (error) => this.toastr.error('Error updating menu item', error),
      });
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

  loadCurrencies(): void {
    this.currencyService.findAllCurrencies().subscribe({
      next: (res: CurrencyDTO[]) => {
        this.allCurrencies = res;
      },
      error: (error) => {
        this.toastr.error('Error fetching currencies:', error);
      },
    });
  }

  closeModal(): void {
    this.store.dispatch(closeUpdateMenuItemModal());
  }
}