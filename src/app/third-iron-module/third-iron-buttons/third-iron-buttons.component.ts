import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { Observable, tap, combineLatestWith, map } from 'rxjs';
import { BrowzineButtonComponent } from '../../components/browzine-button/browzine-button.component';
import { SearchEntity } from '../../types/searchEntity.types';
import { DisplayWaterfallResponse } from '../../types/displayWaterfallResponse.types';
import { SearchEntityService } from '../../services/search-entity.service';
import { ButtonInfoService } from '../../services/button-info.service';
import { ConfigService } from 'src/app/services/config.service';
import { TranslationService } from 'src/app/services/translation.service';
import { AsyncPipe } from '@angular/common';
import { ArticleLinkButtonComponent } from 'src/app/components/article-link-button/article-link-button.component';
import { MainButtonComponent } from 'src/app/components/main-button/main-button.component';
import { ButtonType } from 'src/app/shared/button-type.enum';
import { CombinedLink, OnlineLink, PrimoViewModel } from 'src/app/types/primoViewModel.types';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ViewOptionType } from 'src/app/shared/view-option.enum';
import { StackedDropdownComponent } from 'src/app/components/stacked-dropdown/stacked-dropdown.component';
import { EntityType } from 'src/app/shared/entity-type.enum';

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
    private translationService: TranslationService,
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
    this.displayInfo$ = this.buttonInfoService.getDisplayInfo(searchResult).pipe(
      combineLatestWith(this.hostComponent.viewModel$ as Observable<PrimoViewModel>),
      map(([displayInfo, viewModel]) => {
        console.log('Display info and viewModel combined. VIEW OPTION:', this.viewOption);

        if (this.viewOption !== ViewOptionType.NoStack) {
          // build custom stack options array for StackPlusBrowzine and SingleStack view options
          this.buildStackOptions(displayInfo, viewModel);
        }

        if (this.shouldRemoveLinkResolverLink(displayInfo)) {
          // remove Primo "Online Options" button or Primo generated stack dropdown
          const hostElem = this.elementRef.nativeElement; // this component's template element
          this.removeLinkResolverLink(hostElem);
        }

        return displayInfo;
      })
    );
  };

  buildStackOptions = (displayInfo: DisplayWaterfallResponse, viewModel: PrimoViewModel) => {
    console.log('ViewModel:', JSON.stringify(viewModel));
    this.combinedLinks = [];

    // Handle Third Iron display options
    if (
      displayInfo.entityType !== EntityType.Unknown &&
      displayInfo.mainButtonType !== ButtonType.None
    ) {
      this.combinedLinks.push({
        source: 'thirdIron',
        entityType: displayInfo.entityType,
        mainButtonType: displayInfo.mainButtonType,
        url: displayInfo.mainUrl,
        ariaLabel: '',
        label: '',
      });
    }

    // If we have a secondary Third Iron button, add that to the combinedLinks array as well
    if (displayInfo.showSecondaryButton && displayInfo.secondaryUrl) {
      this.combinedLinks.push({
        source: 'thirdIron',
        entityType: displayInfo.entityType,
        url: displayInfo.secondaryUrl,
        showSecondaryButton: true,
      });
    }

    // TODO - for SingleStack view option, we need to add the browzine button to the combinedLinks array as well

    // Handle Primo onlineLinks (array of Link objects)
    if (viewModel?.onlineLinks && viewModel.onlineLinks.length > 0) {
      const primoFullDisplayHTMLText = this.translationService.getTranslatedText(
        'fulldisplay.HTML',
        'Read Online'
      );
      const primoFullDisplayPDFText = this.translationService.getTranslatedText(
        'fulldisplay.PDF',
        'Get PDF'
      );

      viewModel.onlineLinks.forEach((link: OnlineLink) => {
        this.combinedLinks.push({
          source: link.source,
          entityType: link.type,
          url: link.url,
          ariaLabel: link.ariaLabel || '',
          label: link.type === 'PDF' ? primoFullDisplayPDFText : primoFullDisplayHTMLText,
        });
      });
    }

    // Handle Primo directLink (string) and ariaLabel
    // This anchor tag may change! If the NDE UI site changes, we may need to update this
    const anchor = '&state=#nui.getit.service_viewit';
    if (viewModel.directLink) {
      const primoOnlineOptionsText = this.translationService.getTranslatedText(
        'nde.delivery.code.otherOnlineOptions',
        'Other online options'
      );

      this.combinedLinks.push({
        source: 'directLink',
        entityType: 'directLink',
        url: viewModel.directLink.includes('/nde')
          ? `${viewModel.directLink}${anchor}`
          : `/nde${viewModel.directLink}${anchor}`,
        ariaLabel: viewModel.ariaLabel || '',
        label: primoOnlineOptionsText,
      });
    }

    console.log('Online links:', this.combinedLinks);
  };

  removeLinkResolverLink = (hostElement: HTMLElement) => {
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
  shouldRemoveLinkResolverLink = (displayInfo: DisplayWaterfallResponse) => {
    return (
      !this.configService.showLinkResolverLink() && displayInfo.mainButtonType !== ButtonType.None
    );
  };
}
