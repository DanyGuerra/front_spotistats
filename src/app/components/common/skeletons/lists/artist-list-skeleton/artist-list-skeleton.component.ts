import { generateRandomWidth } from './../../../../../../utils/general-utils';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-artist-list-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './artist-list-skeleton.component.html',
  styleUrls: ['./artist-list-skeleton.component.less'],
})
export class ArtistListSkeletonComponent {
  @Input() showBorder: boolean = false;
  @Input() index!: number;

  generateRandomWidth = generateRandomWidth;
}
