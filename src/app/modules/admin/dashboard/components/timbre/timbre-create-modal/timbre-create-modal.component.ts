import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Timbre } from 'src/app/core/models/timbre.model';
import { closeCreateTimbreModal } from 'src/app/core/state/modal/timbre/timbre.action';
import { TimbreService } from 'src/app/services/timbre-service.service';

@Component({
  selector: '[timbre-create-modal]',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './timbre-create-modal.component.html',
  styleUrl: './timbre-create-modal.component.scss',
})
export class TimbreCreateModalComponent {
  timbreForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly timbreService: TimbreService,
    private readonly store: Store,
    private readonly toastr: ToastrService,
  ) {
    this.timbreForm = this.fb.group({
      amount: [0, Validators.required],
    });
  }

  ngOnInit() {}

  createTimbre(): void {
    if (!this.timbreForm.valid) {
      this.timbreForm.markAllAsTouched();
    } else {
      this.timbreService.createTimbre(this.timbreForm.value).subscribe({
        next: (timbre: Timbre) => {
          this.toastr.success('Timbre created successfully!');
          this.closeModal();
          this.resetForm();
          this.timbreService.createTimbre(timbre);
        },
        error: (error: any) => this.toastr.error('Error creating Timbre!', error?.message || 'Unknown error'),
      });
    }
  }

  private showFormErrors(): void {
    this.timbreForm.markAllAsTouched();

    Object.entries(this.timbreForm.controls).forEach(([key, control]) => {
      if (control.errors) {
        Object.keys(control.errors).forEach((keyError) => {
          this.toastr.error(`Form Invalid - Control: ${key}, Error: ${keyError}`);
        });
      }
    });
  }

  closeModal(): void {
    this.store.dispatch(closeCreateTimbreModal());
  }

  resetForm(): void {
    this.timbreForm.reset({
      name: '',
      description: '',
    });
  }
}
