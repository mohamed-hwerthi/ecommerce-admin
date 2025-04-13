import { createAction, props } from '@ngrx/store';
import { Timbre } from 'src/app/core/models/timbre.model';

export const openCreateTimbreModal = createAction('[Modal] Open Create Timbre Modal');
export const closeCreateTimbreModal = createAction('[Modal] Close Create Timbre Modal');

export const openUpdateTimbreModal = createAction('[Modal] Open Update Timbre Modal', props<{ timbre: Timbre }>());
export const closeUpdateTimbreModal = createAction('[Modal] Close Update Timbre Modal');

export const openDeleteTimbreModal = createAction(
  '[Modal] Open Delete Timbre Modal',
  props<{ timbreId: number | undefined }>(),
);
export const closeDeleteTimbreModal = createAction('[Modal] Close Delete Timbre Modal');
