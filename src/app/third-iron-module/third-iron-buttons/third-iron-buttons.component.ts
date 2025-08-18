import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { Observable, tap, combineLatestWith, map } from 'rxjs';
import { BrowzineButtonComponent } from '../../components/browzine-button/browzine-button.component';
import { SearchEntity } from '../../types/searchEntity.types';
import { DisplayWaterfallResponse } from '../../types/displayWaterfallResponse.types';
import { SearchEntityService } from '../../services/search-entity.service';
import { ButtonInfoService } from '../../services/button-info.service';
import { ConfigService } from 'src/app/services/config.service';
import { AsyncPipe } from '@angular/common';
import { ArticleLinkButtonComponent } from 'src/app/components/article-link-button/article-link-button.component';
import { MainButtonComponent } from 'src/app/components/main-button/main-button.component';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { CombinedLink, PrimoViewModel } from 'src/app/types/primoViewModel.types';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ViewOptionType } from 'src/app/shared/view-option.enum';
import { StackedDropdownComponent } from 'src/app/components/stacked-dropdown/stacked-dropdown.component';

@Component({
  selector: 'custom-third-iron-buttons',
  standalone: true,
  imports: [
    MainButtonComponent,
    BrowzineButtonComponent,
    ArticleLinkButtonComponent,
    AsyncPipe,
    StackedDropdownComponent,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './third-iron-buttons.component.html',
  styleUrls: [
    './third-iron-buttons.component.scss',
    '../../components/stacked-dropdown/stacked-dropdown.component.scss',
  ],
  providers: [SearchEntityService],
  encapsulation: ViewEncapsulation.None,
})
export class ThirdIronButtonsComponent {
  @Input() hostComponent!: any;
  elementRef: ElementRef;
  combinedLinks: CombinedLink[] = []; // used to build custom merged array of online services for stack views
  showDropdown = false;
  viewOption = this.configService.getViewOption();

  // Expose enum to template
  ViewOptionType = ViewOptionType;

  displayInfo$!: Observable<DisplayWaterfallResponse | null>;

  constructor(
    private buttonInfoService: ButtonInfoService,
    private searchEntityService: SearchEntityService,
    private configService: ConfigService,
    elementRef: ElementRef
  ) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
    // Start the process for determining if a button should be displayed and with what info
    this.enhance(this.hostComponent.searchResult);
  }

  enhance = (searchResult: SearchEntity) => {
    if (!this.searchEntityService.shouldEnhance(searchResult)) {
      return;
    }

    // Use combineLatestWith to handle both observables together
    this.displayInfo$ = this.buttonInfoService.getDisplayInfo(searchResult).pipe(
      combineLatestWith(this.hostComponent.viewModel$ as Observable<PrimoViewModel>),
      map(([displayInfo, viewModel]) => {
        console.log('Display info and viewModel combined. VIEW OPTION:', this.viewOption);

        if (this.viewOption !== ViewOptionType.NoStack) {
          // build custom stack options array for StackPlusBrowzine and SingleStack view options
          this.combinedLinks = this.buttonInfoService.buildStackOptions(displayInfo, viewModel);

          // remove Primo generated buttons/stack if we have a custom stack
          if (this.combinedLinks.length > 0) {
            const hostElem = this.elementRef.nativeElement; // this component's template element
            this.removePrimoOnlineAvailability(hostElem);
          }
        } else if (this.shouldRemovePrimoOnlineAvailability(displayInfo)) {
          // remove Primo "Online Options" button or Primo's stack
          const hostElem = this.elementRef.nativeElement; // this component's template element
          this.removePrimoOnlineAvailability(hostElem);
        }

        return displayInfo;
      })
    );
  };

  removePrimoOnlineAvailability = (hostElement: HTMLElement) => {
    if (hostElement?.parentElement?.parentElement) {
      const onlineAvailabilityBlockParent: HTMLElement = hostElement.parentElement.parentElement; // jump up to parent of <nde-record-image />
      if (onlineAvailabilityBlockParent) {
        const onlineAvailabilityElementArray = onlineAvailabilityBlockParent.getElementsByTagName(
          'nde-online-availability'
        ) as HTMLCollectionOf<HTMLElement>;

        Array.from(onlineAvailabilityElementArray).forEach(elem => {
          elem.style.display = 'none';
        });
      }
    }
  };

  // Remove Primo "Online Options" button or Primo generated stack dropdown
  shouldRemovePrimoOnlineAvailability = (displayInfo: DisplayWaterfallResponse) => {
    return (
      !this.configService.showLinkResolverLink() && displayInfo.mainButtonType !== ButtonType.None
    );
  };
}
