// asset-base.service.ts
import { Injectable } from '@angular/core';
import { assetBaseUrl } from '../state/asset-base.generated';

@Injectable({
  providedIn: 'root'
})
export class AssetBaseService {
  private readonly base = assetBaseUrl;

  resolveAssetUrl(relativePath: string): string {
    if (!relativePath) return '';
    if (/^(https?:)?\/\//.test(relativePath)) return relativePath;
    return `${this.base}/${relativePath.replace(/^\/+/, '')}`;
  }
}
