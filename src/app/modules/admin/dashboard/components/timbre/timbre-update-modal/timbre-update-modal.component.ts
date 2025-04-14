import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { closeUpdateTimbreModal } from 'src/app/core/state/modal/timbre/timbre.action';
import { selectTimbreToUpdate } from 'src/app/core/state/modal/timbre/timbre.selector';
import { TimbreService } from 'src/app/services/timbre-service.service';

@Component({
  selector: '[timbre-update-modal]',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './timbre-update-modal.component.html',
  styleUrl: './timbre-update-modal.component.scss',
})
export class TimbreUpdateModalComponent {
  timbreForm: FormGroup;
  private currentTimbreId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly timbreService: TimbreService,
    private readonly toastr: ToastrService,
  ) {
    this.timbreForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.store.select(selectTimbreToUpdate).subscribe((timbre) => {
      if (timbre) {
        this.currentTimbreId = timbre.id;
        this.timbreForm.patchValue({
          amount: timbre.amount,
        });
      }
    });
  }

  handleTimbreUpdating(): void {
    if (this.timbreForm.valid && this.currentTimbreId) {
      this.timbreService.updateTimbre(this.currentTimbreId, this.timbreForm.value).subscribe({
        next: (updatedTimbre) => {
          this.closeModal();
          this.toastr.success('Timbre updated successfully!');
        },
        error: (error) => this.toastr.error('Error updating timbre', error),
      });
    } else {
      this.timbreForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.store.dispatch(closeUpdateTimbreModal());
  }
}
