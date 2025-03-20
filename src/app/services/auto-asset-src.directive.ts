// auto-asset-src.directive.ts
import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2
  } from '@angular/core';
  import { AssetBaseService } from './asset-base.service';
  
  @Directive({
    selector: '[autoAssetSrc]' // <img autoAssetSrc src="assets/..." />
  })
  export class AutoAssetSrcDirective implements OnInit {
    @Input() src: string = '';
  
    constructor(
      private el: ElementRef,
      private renderer: Renderer2,
      private assetService: AssetBaseService
    ) {}
  
    ngOnInit(): void {
        console.log('autoAssetSrc activated for', this.el.nativeElement);
      const tag = this.el.nativeElement.tagName.toLowerCase();
      const resolved = this.assetService.resolveAssetUrl(this.src);
  
      if (tag === 'img' || tag === 'script' || tag === 'iframe' || tag === 'video' || tag === 'source') {
        this.renderer.setAttribute(this.el.nativeElement, 'src', resolved);
      } else {
        // fallback for background-image
        this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${resolved})`);
      }
    }
  }
  