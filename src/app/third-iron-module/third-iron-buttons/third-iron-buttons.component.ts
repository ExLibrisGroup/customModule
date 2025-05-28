import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseButtonComponent } from '../../components/base-button/base-button.component';
import { BrowzineButtonComponent } from '../../components/browzine-button/browzine-button.component';
import { SearchEntity } from '../../types/searchEntity.types';
import { ButtonInfo } from '../../types/buttonInfo.types';
import { SearchEntityService } from '../../services/search-entity.service';
import { ButtonInfoService } from '../../services/button-info.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'custom-third-iron-buttons',
  standalone: true,
  imports: [BaseButtonComponent, BrowzineButtonComponent, AsyncPipe],
  templateUrl: './third-iron-buttons.component.html',
  styleUrl: './third-iron-buttons.component.scss',
  providers: [SearchEntityService],
})
export class ThirdIronButtonsComponent {
  @Input() private hostComponent!: any;

  buttonInfo$!: Observable<ButtonInfo>;

  constructor(
    private buttonInfoService: ButtonInfoService,
    private searchEntityService: SearchEntityService
  ) {}

  ngOnInit() {
    // Start the process for determining if a button should be displayed and with what info
    this.enhance(this.hostComponent.searchResult);
  }

  enhance = (searchResult: SearchEntity) => {
    if (!this.searchEntityService.shouldEnhance(searchResult)) {
      return;
    }

    this.buttonInfo$ = this.buttonInfoService.getButtonInfo(searchResult);
  };
}
