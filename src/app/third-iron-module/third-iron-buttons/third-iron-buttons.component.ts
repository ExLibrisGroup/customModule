import { Component, ElementRef, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
import {
  OnlineService,
  PrimoViewModel,
} from 'src/app/types/primoViewModel.types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewOptionType } from 'src/app/shared/view-option.enum';

@Component({
  selector: 'custom-third-iron-buttons',
  standalone: true,
  imports: [
    MainButtonComponent,
    BrowzineButtonComponent,
    ArticleLinkButtonComponent,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './third-iron-buttons.component.html',
  styleUrl: './third-iron-buttons.component.scss',
  providers: [SearchEntityService],
})
export class ThirdIronButtonsComponent {
  @Input() hostComponent!: any;
  elementRef: ElementRef;
  onlineServices: OnlineService[] = []; // used to build custom merged array of online services for stack views

  displayInfo$!: Observable<DisplayWaterfallResponse>;

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

    this.displayInfo$ = this.buttonInfoService.getDisplayInfo(searchResult);

    // subscribe to displayInfo$ observable to continue only after we have a response
    this.displayInfo$.subscribe((displayInfo) => {
      //TODO: (this.configService.getViewOption() !== ViewOptionType.NoStack) {
      if (true) {
        this.hostComponent.viewModel$
          .pipe(
            tap((viewModel: PrimoViewModel) => {
              console.log('ViewModel:', JSON.stringify(viewModel));

              // Handle directLink (string) and ariaLabel
              if (viewModel.directLink) {
                this.onlineServices.push({
                  type: 'directLink',
                  url: viewModel.directLink,
                  ariaLabel: viewModel.ariaLabel || '',
                });
              }

              // Handle onlineLinks (array of Link objects)
              if (viewModel.onlineLinks && viewModel.onlineLinks.length > 0) {
                // this.onlineServices.push(
                //   ...viewModel.onlineLinks.map(
                //     (link: { source: string; type: string; url: string }) => ({
                //       ...link,
                //       type: 'onlineLink',
                //       ariaLabel: link.source || '',
                //     }))
                //   );
                // }
                viewModel.onlineLinks.forEach((link) => {
                  this.onlineServices.push({
                    source: link.source,
                    type: 'onlineLink',
                    url: link.url,
                    ariaLabel: link.source || '',
                  });
                });
              }

              console.log('Online services:', this.onlineServices);
            })
          )
          .subscribe();
      } else if (this.shouldRemoveLinkResolverLink(displayInfo)) {
        // remove primo button
        const hostElem = this.elementRef.nativeElement; // this component's template element
        this.removeLinkResolverLink(hostElem);
      }
    });
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
}
