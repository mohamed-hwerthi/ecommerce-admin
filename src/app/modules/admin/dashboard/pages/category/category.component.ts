import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoryAuctionsTableComponent } from '../../components/category-auctions-table/category-auctions-table.component';
import { CategoryCreateModalComponent } from '../../components/category-create-modal/category-create-modal.component';
import { CategoryUpdateModalComponent } from '../../components/category/category-update-modal/category-update-modal.component';
import { Store } from '@ngrx/store';
import {
  selectIsCreateCategoryModalOpen,
  selectIsDeleteCategoryModalOpen,
  selectIsUpdateCategoryModalOpen,
} from 'src/app/core/state/modal/category/modal.selector';
import { CategoryDeleteModalComponent } from '../../components/category-delete-modal/category-delete-modal.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    CategoryAuctionsTableComponent,
    CategoryCreateModalComponent,
    CategoryUpdateModalComponent,
    CategoryDeleteModalComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  constructor(private readonly store: Store) {}
  showCreateCategoryModal$ = this.store.select(selectIsCreateCategoryModalOpen);
  showDeletecategoryModal$ = this.store.select(selectIsDeleteCategoryModalOpen);
  showUpdatecategoryModal$ = this.store.select(selectIsUpdateCategoryModalOpen);
}
