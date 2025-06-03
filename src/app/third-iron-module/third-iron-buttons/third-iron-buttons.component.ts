import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowzineButtonComponent } from '../../components/browzine-button/browzine-button.component';
import { SearchEntity } from '../../types/searchEntity.types';
import { DisplayWaterfallResponse } from '../../types/displayWaterfallResponse.types';
import { SearchEntityService } from '../../services/search-entity.service';
import { ButtonInfoService } from '../../services/button-info.service';
import { AsyncPipe } from '@angular/common';
import { ArticleLinkButtonComponent } from 'src/app/components/article-link-button/article-link-button.component';
import { MainButtonComponent } from 'src/app/components/main-button/main-button.component';

@Component({
  selector: 'custom-third-iron-buttons',
  standalone: true,
  imports: [
    MainButtonComponent,
    BrowzineButtonComponent,
    ArticleLinkButtonComponent,
    AsyncPipe,
  ],
  templateUrl: './third-iron-buttons.component.html',
  styleUrl: './third-iron-buttons.component.scss',
  providers: [SearchEntityService],
})
export class ThirdIronButtonsComponent {
  @Input() private hostComponent!: any;

  displayInfo$!: Observable<DisplayWaterfallResponse>;

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

    this.displayInfo$ = this.buttonInfoService.getDisplayInfo(searchResult);
  };
}
