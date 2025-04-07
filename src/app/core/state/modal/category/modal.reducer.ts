import { createReducer, on } from '@ngrx/store';
import { CategoryDTO } from 'src/app/core/models/category.model';
import * as ModalActions from './modal.action';
export interface ModalState {
  createCategory: boolean;
  updateCategory: boolean;
  deleteCategory: boolean;
  delteCategoryId: number | undefined | null;
  categoryToUpdate: CategoryDTO | null;
}
export const initialState: ModalState = {
  createCategory: false,
  updateCategory: false,
  deleteCategory: false,
  delteCategoryId: null,
  categoryToUpdate: null,
};

export const categoryModalReducer = createReducer(
  initialState,
  on(ModalActions.openCreateCategoryModal, (state) => {
    return { ...state, createCategory: true };
  }),

  on(ModalActions.closeCreateCategoryModal, (state) => ({ ...state, createCategory: false })),
  on(ModalActions.openUpdatecategoryModal, (state, { category }) => ({
    ...state,
    updateCategory: true,
    categoryToUpdate: category,
  })),
  on(ModalActions.closeUpdatecategoryModal, (state) => ({ ...state, updateCategory: false })),
  on(ModalActions.openDeleteCategoryModal, (state, { categoryId }) => ({
    ...state,
    deleteCategory: true,
    delteCategoryId: categoryId,
  })),
  on(ModalActions.closeDeletecCategoryModal, (state) => ({ ...state, deleteCategory: false })),
);
