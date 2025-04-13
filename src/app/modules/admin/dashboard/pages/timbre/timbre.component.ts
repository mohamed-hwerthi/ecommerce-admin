import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectIsCreateTimbreModalOpen,
  selectIsDeleteTimbreModalOpen,
  selectIsUpdateTimbreModalOpen,
} from 'src/app/core/state/modal/timbre/timbre.selector';
import { DeleteTimbreModalComponent } from '../../components/timbre/delete-timbre-modal/delete-timbre-modal.component';
import { TimbreAuctionTableComponent } from '../../components/timbre/timbre-auction-table/timbre-auction-table.component';
import { TimbreCreateModalComponent } from '../../components/timbre/timbre-create-modal/timbre-create-modal.component';

@Component({
  selector: 'app-timbre',
  standalone: true,
  imports: [CommonModule, TimbreAuctionTableComponent, TimbreCreateModalComponent, DeleteTimbreModalComponent],
  templateUrl: './timbre.component.html',
  styleUrl: './timbre.component.scss',
})
export class TimbreComponent {
  constructor(private readonly store: Store) {}

  showCreateTimbreModal$ = this.store.select(selectIsCreateTimbreModalOpen);
  showDeleteTimbreModal$ = this.store.select(selectIsDeleteTimbreModalOpen);
  showUpdateTimbreModal$ = this.store.select(selectIsUpdateTimbreModalOpen);
}
