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

@Component({
  selector: '[menuItem-update-modal]',
  templateUrl: './menuItem-update-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , MultiSelectModule],
})
export class MenuItemUpdateModalComponent implements OnInit {
  menuItemForm: FormGroup;
  // menuItems$: Observable<MenuItem[]>;
  private currentMenuItemId: number | null = null;
  allCategories: CategoryDTO[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private  readonly store: Store,
    private readonly  menuItemsService: MenuItemsService,
    private  readonly toastr: ToastrService,
    private readonly categoryService:CategoryService
  ) {
    // Initialize the form with structure
    this.menuItemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [1, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/)]],
      categories: [null, Validators.required],
      barCode: [''],

    });

    // this.menuItems$ = this.menuItemsService.getAllMenuItems();
  }

  ngOnInit(): void {

    this.loadCategories();
    this.store.select(selectMenuItemToUpdate).subscribe((menuItem) => {
      if (menuItem) {
        this.currentMenuItemId = menuItem.id;
        this.menuItemForm.patchValue({
          title: menuItem.title,
          description: menuItem.description,
          price: menuItem.price,
          categories: menuItem.categories,
          barCode:menuItem.barCode
        });
      }
    });
  }

  updateMenuItem(): void {
    if (this.menuItemForm.valid && this.currentMenuItemId) {
      this.menuItemsService.updateMenuItem(this.currentMenuItemId, this.menuItemForm.value).subscribe({
        next: (MenuItem) => {
          this.closeModal();
          this.menuItemsService.menuItemUpdated(MenuItem);
          this.toastr.success('Menu item updated successfully!');
        },
        error: (error) => this.toastr.error('Error updating menu item', error),
      });
    }  else {
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
}
