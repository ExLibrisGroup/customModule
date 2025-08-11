import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { OnlineService } from 'src/app/types/primoViewModel.types';
import { PrimoPdfIconComponent } from '../icons/primo-pdf.component';

@Component({
  selector: 'stacked-dropdown',
  standalone: true,
  imports: [MatButtonModule, MatSelectModule, PrimoPdfIconComponent],
  templateUrl: './stacked-dropdown.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StackedDropdownComponent {
  onlineServices = input.required<OnlineService[]>();

  openService(service: OnlineService) {
    if (service && service.url) {
      window.open(service.url, '_blank');
    }
  }
}
