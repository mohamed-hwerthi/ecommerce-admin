import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AngularSvgIconModule, RouterModule, TranslateModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {}
