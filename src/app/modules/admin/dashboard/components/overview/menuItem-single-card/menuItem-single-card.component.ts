import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../../../../../core/models';

@Component({
  selector: '[menuItem-single-card]',
  templateUrl: './menuItem-single-card.component.html',
  standalone: true,
  imports: [NgStyle, RouterLink],
})
export class MenuItemSingleCardComponent implements OnInit {
  @Input() menuItem: MenuItem = <MenuItem>{};

  constructor() {}

  ngOnInit(): void {}
}
