import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, interval, startWith, switchMap } from 'rxjs';
import { Order } from '../../../../../../core/models';
import { openCreateOrderModal } from '../../../../../../core/state/modal/order/modal.actions';
import { OrdersService } from '../../../../../../services/orders.service';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { LoaderComponent } from '../../../../../../shared/components/loader/loader.component';
import { PaginationComponent } from '../../../../../../shared/components/pagination/pagination.component';
import { OrderCreateModalComponent } from '../order-create-modal/order-create-modal.component';
import { OrdersTableItemComponent } from '../orders-table-item/orders-table-item.component';
@Component({
  selector: '[orders-table]',
  templateUrl: './orders-table.component.html',
  standalone: true,
  imports: [
    NgFor,
    OrdersTableItemComponent,
    OrderCreateModalComponent,
    CommonModule,
    LoaderComponent,
    AngularSvgIconModule,
    ButtonComponent,
    PaginationComponent,
  ],
})
export class OrdersTableComponent implements OnInit {
  public orders: Order[] = [];
  public isLoading: boolean = true;
  public currentPage = 1;
  public totalPages!: number;
  public timeSinceLastUpdate$!: Observable<number>;
  public lastUpdated: Date = new Date();

  private subscriptions: Subscription = new Subscription();

  constructor(private ordersService: OrdersService, private store: Store, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadOrders(this.currentPage);
    this.initializeSubscriptions();
    this.initializeTimeSinceLastUpdate();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrders(page: number, limit: number = 10): void {
    this.isLoading = true;
    this.ordersService.getAllOrders(page, limit).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.totalPages = Math.ceil(50 / limit); //change later
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders(this.currentPage);
  }

  openCreateModal() {
    this.store.dispatch(openCreateOrderModal());
  }

  private initializeTimeSinceLastUpdate(): void {
    this.timeSinceLastUpdate$ = interval(60000) // Emit value every 60 seconds
      .pipe(
        startWith(0), // Start immediately upon subscription
        switchMap(() => {
          const now = new Date();
          const difference = now.getTime() - this.lastUpdated.getTime();
          return [Math.floor(difference / 60000)]; // Convert to minutes
        }),
      );
  }

  private initializeSubscriptions(): void {
    const orderCreatedSub = this.ordersService.orderCreated$.subscribe((order) => {
      if (order) {
        this.loadOrders(this.currentPage);
        // this.orders.unshift(order);
      }
    });
    const orderDeletedSub = this.ordersService.orderDeleted$.subscribe((deletedOrderId) => {
      if (deletedOrderId) {
        this.orders = this.orders.filter((order) => order.id !== deletedOrderId);
      }
    });
    const orderUpdatedSub = this.ordersService.orderUpdated$.subscribe((updatedOrder) => {
      if (updatedOrder) {
        const index = this.orders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder; // Update the order in the list
        }
      }
    });
    this.subscriptions.add(orderCreatedSub);
    this.subscriptions.add(orderDeletedSub);
    this.subscriptions.add(orderUpdatedSub);
  }
}
