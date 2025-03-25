import { createSelector } from '@ngrx/store';
import { ModalState } from './modal.reducer';

export const selectCategoryModalState = (state: any) => state.categoryModals;

export const selectIsCreateCategoryModalOpen = createSelector(
  selectCategoryModalState,
  (state: ModalState) => state.createCategory,
);

export const selectIsUpdateCategoryModalOpen = createSelector(
  selectCategoryModalState,
  (state: ModalState) => state.updateCategory,
);

export const selectIsDeleteCategoryModalOpen = createSelector(
  selectCategoryModalState,
  (state: ModalState) => state.deleteCategory,
);

export const selectDeleteCategoryId = createSelector(
  selectCategoryModalState,
  (state: ModalState) => state.delteCategoryId,
);

export const selectCategoryToUpdate = createSelector(
  selectCategoryModalState,
  (state: ModalState) => state.categoryToUpdate,
);
