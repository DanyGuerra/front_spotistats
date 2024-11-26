import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopArtistItem } from 'src/app/interfaces/IResponseTopArtists';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-artist-list-item',
  standalone: true,
  imports: [CommonModule, ImageModule],
  templateUrl: './artist-list-item.component.html',
  styleUrls: ['./artist-list-item.component.less'],
})
export class ArtistListItemComponent {
  @Input() artist!: TopArtistItem;
  @Input() showBorder: boolean = false;

  handleClick(url: string) {
    window.open(url, '_blank');
  }
}
