import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[src],source[src],link[href],script[src],a[href]',
  standalone: true,
})
export class AssetsPublicPathDirective implements OnChanges {
  @Input() src?: string;
  @Input() href?: string;

  constructor(private el: ElementRef, private r: Renderer2) {}

  ngOnChanges(): void {
    // Handle [src] / src and [href] / href
    const tag = (this.el.nativeElement.tagName || '').toLowerCase();
    const attr = tag === 'link' || tag === 'a' ? 'href' : 'src';
    const val = attr === 'href' ? (this.href ?? this.el.nativeElement.getAttribute('href')) : (this.src ?? this.el.nativeElement.getAttribute('src'));

    if (!val) return;

    const rewritten = this.rewriteIfAssets(val);
    if (rewritten !== val) {
      this.r.setAttribute(this.el.nativeElement, attr, rewritten);
    }
  }

  private rewriteIfAssets(url: string): string {
    // Don’t touch absolute URLs, data:, blob:, etc.
    if (/^(https?:)?\/\//i.test(url) || /^data:|^blob:/i.test(url)) return url;

    // Normalize
    const clean = url.startsWith('/') ? url.slice(1) : url;

    if (clean.startsWith('assets/')) {
      return new URL(import.meta.env.DEV ? `/${clean}` : clean, import.meta.url).href;
    }

    return url;
  }
}
