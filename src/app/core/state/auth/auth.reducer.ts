import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../../models';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,
  isUpdatingInfo: false
};
// In auth.reducer.ts
export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => {
    return { ...state, isLoading: true };
  }),
  on(AuthActions.loginSuccess, (state, { user }) => {
    return { ...state, isAuthenticated: true, user, error: null, isLoading: false };
  }),
  on(AuthActions.restoreSessionSuccess, (state, { user }) => {
    return { ...state, isAuthenticated: true, user, error: null, isLoading: false };
  }),
  on(AuthActions.loginFailure, (state, { error }) => {
    return { ...state, error, isLoading: false };
  }),
  on(AuthActions.logout, () => {
    return initialState;
  }),
  on(AuthActions.updateUserProfile, (state) => ({
    ...state,
    isUpdatingInfo: true,
    error: null,
  })),
  on(AuthActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isUpdatingInfo: false,
    error: null,
  })),
  on(AuthActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    isUpdatingInfo: false,
    error,
  }))
);
