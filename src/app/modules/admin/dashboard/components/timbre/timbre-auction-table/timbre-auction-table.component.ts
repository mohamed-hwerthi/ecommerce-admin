import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { interval, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { Timbre } from 'src/app/core/models/timbre.model';
import { openCreateTimbreModal } from 'src/app/core/state/modal/timbre/timbre.action';
import { TimbreService } from 'src/app/services/timbre-service.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { TimbreAuctionTableItemComponent } from '../timbre-auction-item-table/timbre-auction-item-table.component';

@Component({
  selector: '[timbre-auction-table]',
  standalone: true,
  imports: [
    NgFor,
    AngularSvgIconModule,
    ButtonComponent,
    CommonModule,
    LoaderComponent,
    FormsModule,
    TimbreAuctionTableItemComponent,
  ],
  templateUrl: './timbre-auction-table.component.html',
  styleUrl: './timbre-auction-table.component.scss',
})
export class TimbreAuctionTableComponent {
  public timbres: Timbre[] = [];
  public isLoading: boolean = true;
  public currentPage = 1;
  public totalPages!: number;
  public timeSinceLastUpdate$!: Observable<number>;
  public lastUpdated: Date = new Date();
  selectedItemIds: Set<number> = new Set<number>();
  public originalTimbres: Timbre[] = [];

  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    private readonly timbreService: TimbreService,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params[''] || 1;
      this.loadTimbres();
    });
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTimbres(): void {
    this.isLoading = true;

    this.timbreService.findAllTimbres().subscribe({
      next: (res: Timbre[]) => {
        this.originalTimbres = res;
        this.timbres = [...this.originalTimbres];
        this.isLoading = false;
      },
      error: (error) => {
        console.log('error in getting timbres ');
      },
    });
  }

  openCreateModal() {
    this.store.dispatch(openCreateTimbreModal());
  }

  private initializeTimeSinceLastUpdate(): void {
    this.timeSinceLastUpdate$ = interval(60000).pipe(
      startWith(0),
      switchMap(() => {
        const now = new Date();
        const difference = now.getTime() - this.lastUpdated.getTime();
        return [Math.floor(difference / 60000)];
      }),
    );
  }

  private initializeSubscriptions(): void {
    const timbreCreatedSub = this.timbreService.timbreCreated$.subscribe((timbre) => {
      if (timbre) {
        this.loadTimbres();
      }
    });

    const timbreUpdatedSub = this.timbreService.timbreUpdated$.subscribe((updatedTimbre) => {
      if (updatedTimbre) {
        this.loadTimbres();
      }
    });

    const timbreDeletedSub = this.timbreService.timbreDeleted$.subscribe((deletedTimbre) => {
      this.timbres = this.timbres.filter((item) => item.id !== deletedTimbre);
    });

    this.subscriptions.add(timbreCreatedSub);
    this.subscriptions.add(timbreUpdatedSub);
    this.subscriptions.add(timbreDeletedSub);
  }

  isSelected(id: number): boolean {
    return this.selectedItemIds.has(id);
  }

  onToggleSelection(id: number): void {
    if (this.selectedItemIds.has(id)) {
      this.selectedItemIds.delete(id);
    } else {
      this.selectedItemIds.add(id);
    }
  }

  toggleAllSelection(): void {
    const allSelected = this.isAllSelected();

    if (allSelected) {
      this.selectedItemIds.clear();
    } else {
      this.timbres.forEach((item) => this.selectedItemIds.add(item.id));
    }

    this.cdRef.detectChanges();
  }

  isAllSelected(): boolean {
    return this.timbres.length > 0 && this.timbres.every((item) => this.selectedItemIds.has(item.id));
  }

  trackById(index: number, item: Timbre): number {
    return item.id;
  }

  getSelectedItemIds(): number[] {
    return Array.from(this.selectedItemIds);
  }
  isAllowedToCreateTimbre(): boolean {
    return this.timbres.length === 0;
  }
}
