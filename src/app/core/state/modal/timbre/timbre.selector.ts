import { createSelector } from '@ngrx/store';
import { TimbreModalState } from './timbre.reducer';

export const selectTimbreModalState = (state: any) => state.timbreModal;

export const selectIsCreateTimbreModalOpen = createSelector(
  selectTimbreModalState,
  (state: TimbreModalState) => state.createTimbre,
);

export const selectIsUpdateTimbreModalOpen = createSelector(
  selectTimbreModalState,
  (state: TimbreModalState) => state.updateTimbre,
);

export const selectIsDeleteTimbreModalOpen = createSelector(
  selectTimbreModalState,
  (state: TimbreModalState) => state.deleteTimbre,
);

export const selectDeleteTimbreId = createSelector(
  selectTimbreModalState,
  (state: TimbreModalState) => state.deleteTimbreId,
);

export const selectTimbreToUpdate = createSelector(
  selectTimbreModalState,
  (state: TimbreModalState) => state.timbreToUpdate,
);
