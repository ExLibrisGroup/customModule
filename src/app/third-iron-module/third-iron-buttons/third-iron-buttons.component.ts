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
import { OnlineLink, PrimoViewModel } from 'src/app/types/primoViewModel.types';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  styleUrls: ['./third-iron-buttons.component.scss'],
  providers: [SearchEntityService],
  encapsulation: ViewEncapsulation.None,
})
export class ThirdIronButtonsComponent {
  @Input() hostComponent!: any;
  elementRef: ElementRef;
  onlineLinks: OnlineLink[] = []; // used to build custom merged array of online services for stack views
  showDropdown = false;
  viewOption = this.configService.getViewOption();

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

    // Use combineLatestWith (modern approach) to handle both observables together
    this.displayInfo$ = this.buttonInfoService
      .getDisplayInfo(searchResult)
      .pipe(
        combineLatestWith(
          this.hostComponent.viewModel$ as Observable<PrimoViewModel>
        ),
        map(([displayInfo, viewModel]) => {
          console.log(
            'Display info and viewModel combined. VIEW OPTION:',
            this.viewOption
          );

          //TODO: (this.configService.getViewOption() !== ViewOptionType.NoStack) {
          if (true) {
            console.log('ViewModel:', JSON.stringify(viewModel));
            this.onlineLinks = [];

            // Handle onlineLinks (array of Link objects)
            if (viewModel?.onlineLinks && viewModel.onlineLinks.length > 0) {
              viewModel.onlineLinks.forEach((link: OnlineLink) => {
                this.onlineLinks.push({
                  source: link.source,
                  type: link.type,
                  url: link.url,
                  ariaLabel: link.ariaLabel || '',
                  label: link.type === 'PDF' ? 'Get PDF' : 'Read Online',
                });
              });
            }

            // Handle directLink (string) and ariaLabel
            // This anchor tag may change! If the NDE UI site changes, we may need to update this
            const anchor = '&state=#nui.getit.service_viewit';
            if (viewModel.directLink) {
              this.onlineLinks.push({
                source: 'directLink',
                type: 'directLink',
                url: viewModel.directLink.includes('/nde')
                  ? `${viewModel.directLink}${anchor}`
                  : `/nde${viewModel.directLink}${anchor}`,
                ariaLabel: viewModel.ariaLabel || '',
                label: 'Other online options',
              });
            }

            console.log('Online links:', this.onlineLinks);
          } else if (this.shouldRemoveLinkResolverLink(displayInfo)) {
            // remove primo button
            const hostElem = this.elementRef.nativeElement; // this component's template element
            this.removeLinkResolverLink(hostElem);
          }

          return displayInfo;
        })
      );
  };

  removeLinkResolverLink = (hostElement: HTMLElement) => {
    if (hostElement?.parentElement?.parentElement) {
      const onlineAvailabilityBlockParent: HTMLElement =
        hostElement.parentElement.parentElement; // jump up to parent of <nde-record-image />
      if (onlineAvailabilityBlockParent) {
        const onlineAvailabilityElementArray =
          onlineAvailabilityBlockParent.getElementsByTagName(
            'nde-online-availability'
          ) as HTMLCollectionOf<HTMLElement>;

        Array.from(onlineAvailabilityElementArray).forEach((elem) => {
          elem.style.display = 'none';
        });
      }
    }
  };

  // For NoStack option only
  shouldRemoveLinkResolverLink = (displayInfo: DisplayWaterfallResponse) => {
    // TODO: if configService.getViewOption() !== ViewOptionType.NoStack, then always return true
    return (
      !this.configService.showLinkResolverLink() &&
      displayInfo.mainButtonType !== ButtonType.None
    );
  };

  openService(service: OnlineLink) {
    if (service && service.url) {
      window.open(service.url, '_blank');
    }
  }
}
