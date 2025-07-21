import { Component, ElementRef, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs';
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
  @Input() hostComponent!: any;
  elementRef: ElementRef;

  displayInfo$!: Observable<DisplayWaterfallResponse>;

  constructor(
    private buttonInfoService: ButtonInfoService,
    private searchEntityService: SearchEntityService,
    private configService: ConfigService,
    elementRef: ElementRef,
    @Inject('MODULE_PARAMETERS') public moduleParameters: any
  ) {
    this.elementRef = elementRef;
    console.log(
      'Module parameters TestBottomComponent:',
      this.moduleParameters
    );
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
      if (this.shouldRemoveLinkResolverLink(displayInfo)) {
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

  shouldRemoveLinkResolverLink = (displayInfo: DisplayWaterfallResponse) => {
    return (
      !this.configService.showLinkResolverLink() &&
      displayInfo.mainButtonType !== ButtonType.None
    );
  };
}
