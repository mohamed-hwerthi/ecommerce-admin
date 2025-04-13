import { createReducer, on } from '@ngrx/store';
import { Timbre } from 'src/app/core/models/timbre.model';
import * as TimbreModalActions from './timbre.action';

export interface TimbreModalState {
  createTimbre: boolean;
  updateTimbre: boolean;
  deleteTimbre: boolean;
  deleteTimbreId: number | undefined | null;
  timbreToUpdate: Timbre | null;
}

export const initialTimbreModalState: TimbreModalState = {
  createTimbre: false,
  updateTimbre: false,
  deleteTimbre: false,
  deleteTimbreId: null,
  timbreToUpdate: null,
};

export const timbreModalReducer = createReducer(
  initialTimbreModalState,

  on(TimbreModalActions.openCreateTimbreModal, (state) => ({
    ...state,
    createTimbre: true,
  })),
  on(TimbreModalActions.closeCreateTimbreModal, (state) => ({
    ...state,
    createTimbre: false,
  })),

  on(TimbreModalActions.openUpdateTimbreModal, (state, { timbre }) => ({
    ...state,
    updateTimbre: true,
    timbreToUpdate: timbre,
  })),
  on(TimbreModalActions.closeUpdateTimbreModal, (state) => ({
    ...state,
    updateTimbre: false,
    timbreToUpdate: null,
  })),

  on(TimbreModalActions.openDeleteTimbreModal, (state, { timbreId }) => ({
    ...state,
    deleteTimbre: true,
    deleteTimbreId: timbreId,
  })),
  on(TimbreModalActions.closeDeleteTimbreModal, (state) => ({
    ...state,
    deleteTimbre: false,
    deleteTimbreId: null,
  })),
);
