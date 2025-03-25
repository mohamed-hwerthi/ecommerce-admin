import { createAction, props } from "@ngrx/store";
import { CategoryDTO } from "src/app/core/models/category.model";

export const openCreateCategoryModal = createAction('[Modal] Open Create category Modal');
export const closeCreateCategoryModal = createAction('[Modal] Close Create category Modal');


export const openUpdatecategoryModal = createAction('[Modal] Open Update category Modal', props<{ category: CategoryDTO }>());
export const closeUpdatecategoryModal = createAction('[Modal] Close Update category Modal');

export const openDeleteCategoryModal = createAction('[Modal] Open Delete category Modal', props<{ categoryId: number | undefined }>());
export const closeDeletecCategoryModal = createAction('[Modal] Close Delete category Modal');