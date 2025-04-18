import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../../../../../core/models';

@Component({
  selector: '[menuItem-dual-card]',
  templateUrl: './menuItem-dual-card.component.html',
  standalone: true,
  imports: [NgStyle, RouterLink],
})
export class MenuItemDualCardComponent {
  @Input() menuItem: MenuItem = <MenuItem>{};

  constructor() {}

  ngOnInit(): void {}
}
