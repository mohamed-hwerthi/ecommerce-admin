import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models';
import { CategoryDTO } from 'src/app/core/models/category.model';
import { selectCurrentUser } from 'src/app/core/state/auth/auth.selectors';
import { openDeleteCategoryModal, openUpdatecategoryModal } from 'src/app/core/state/modal/category/modal.action';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: '[category-auction-table-item]',
  standalone: true,
  imports: [AngularSvgIconModule, CurrencyPipe, ButtonComponent, CommonModule],
  templateUrl: './category-auction-table-item.component.html',
  styleUrl: './category-auction-table-item.component.scss',
})
export class CategoryAuctionTableItemComponent {
  @Input() category: CategoryDTO = <CategoryDTO>{};
  @Input() selectedItemIds: number[] = [];
  @Input() onToggleSelection: (id: number) => void = () => {};
  @Input() isSelected: (id: number) => boolean = () => false;

  currentUser$: Observable<User | null>;

  constructor(private readonly store: Store) {
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

  ngOnInit(): void {}
  handleCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onToggleSelection(this.category.id);
  }

  handleUpdateButtonClick(currentUser: User, category: CategoryDTO): void {
    // Only Admin can update default items
    // if (currentUser.role === 'Admin' || (currentUser.role === 'Moderator' && !category.defaultItem)) {
    // }
    this.openUpdateModal();
  }

  openUpdateModal() {
    this.store.dispatch(openUpdatecategoryModal({ category: this.category }));
  }

  openDeleteModal() {
    this.store.dispatch(openDeleteCategoryModal({ categoryId: this.category.id }));
  }
}
