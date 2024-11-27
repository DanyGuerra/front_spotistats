import { TopArtistItem } from './../../../../interfaces/IResponseTopArtists';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-artist-card-item',
  standalone: true,
  imports: [CommonModule, CardModule, ImageModule],
  templateUrl: './artist-card-item.component.html',
  styleUrls: ['./artist-card-item.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistCardItemComponent {
  @Input() artist!: TopArtistItem;

  handleImageClick(url: string) {
    window.open(url, '_blank');
  }
}
