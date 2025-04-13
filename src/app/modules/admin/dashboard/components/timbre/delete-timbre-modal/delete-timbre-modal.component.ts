import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { closeDeleteTimbreModal } from 'src/app/core/state/modal/timbre/timbre.action';
import { selectDeleteTimbreId } from 'src/app/core/state/modal/timbre/timbre.selector';
import { TimbreService } from 'src/app/services/timbre-service.service';

@Component({
  selector: '[delete-timbre-modal]',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-timbre-modal.component.html',
  styleUrl: './delete-timbre-modal.component.scss',
})
export class DeleteTimbreModalComponent implements OnDestroy {
  timbreIdToDelete: number | null | undefined = null;
  private readonly subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly timbreService: TimbreService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
  ) {
    this.subscription.add(
      this.store.select(selectDeleteTimbreId).subscribe((id) => {
        this.timbreIdToDelete = id;
      }),
    );
  }

  deleteTimbre(): void {
    if (!this.timbreIdToDelete) {
      this.toastr.error('Timbre ID is missing!');
      return;
    }

    this.timbreService.deleteTimbre(this.timbreIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Timbre supprimé avec succès');
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error('Échec de la suppression du timbre', error.message);
      },
    });
  }

  closeModal(): void {
    this.store.dispatch(closeDeleteTimbreModal());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
