import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models';
import { Timbre } from 'src/app/core/models/timbre.model';
import { selectCurrentUser } from 'src/app/core/state/auth/auth.selectors';
import { openDeleteTimbreModal, openUpdateTimbreModal } from 'src/app/core/state/modal/timbre/timbre.action';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: '[timbre-auction-table-item]',
  standalone: true,
  imports: [AngularSvgIconModule, ButtonComponent, CommonModule],
  templateUrl: './timbre-auction-item-table.component.html',
})
export class TimbreAuctionTableItemComponent {
  @Input() timbre: Timbre = <Timbre>{};
  @Input() onToggleSelection: (id: number) => void = () => {};
  @Input() isSelected: (id: number) => boolean = () => false;

  currentUser$: Observable<User | null>;

  constructor(private readonly store: Store) {
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

  ngOnInit(): void {
    console.log(this.timbre);
  }

  handleUpdateButtonClick(currentUser: User, timbre: Timbre): void {
    this.openUpdateModal();
  }

  openUpdateModal() {
    this.store.dispatch(openUpdateTimbreModal({ timbre: this.timbre }));
  }

  openDeleteModal() {
    this.store.dispatch(openDeleteTimbreModal({ timbreId: this.timbre.id }));
  }
}
