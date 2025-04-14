import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Observable } from 'rxjs';
import { User } from '../../../../../../core/models';
import * as AuthActions from '../../../../../../core/state/auth/auth.actions';
import { selectCurrentUser } from '../../../../../../core/state/auth/auth.selectors';
import { ThemeService } from '../../../../../../services/theme.service';
import { ClickOutsideDirective } from '../../../../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, AngularSvgIconModule, CommonModule, RouterModule, TranslateModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  user$: Observable<User | null>;
  public isOpen = false;
  public profileMenu = [
    /*     {
      key: 'PROFILE_MENU.PROFILE',
      icon: './assets/icons/heroicons/outline/user-circle.svg',
      link: '/profile',
    },
    {
      key: 'PROFILE_MENU.ORDERS',
      icon: './assets/icons/heroicons/outline/cog-6-tooth.svg',
      link: '/orders',
    },
    {
      key: 'PROFILE_MENU.REVIEWS',
      icon: './assets/icons/heroicons/outline/star.svg',
      link: '/reviews',
    }, */
    {
      key: 'PROFILE_MENU.LOGOUT',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '/auth',
    },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];

  constructor(public themeService: ThemeService, private readonly router: Router, private readonly store: Store) {
    this.user$ = this.store.pipe(select(selectCurrentUser));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
  public onMenuItemClick(item: any): void {
    if (item.key === 'PROFILE_MENU.LOGOUT') {
      this.logout();
    } else {
      this.router.navigate([item.link]);
    }
  }

  ngOnInit(): void {}

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }
}
