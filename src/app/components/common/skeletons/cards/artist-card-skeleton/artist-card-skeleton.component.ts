import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-artist-card-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './artist-card-skeleton.component.html',
  styleUrls: ['./artist-card-skeleton.component.less'],
})
export class ArtistCardSkeletonComponent {
  @Input() showRank: boolean = true;
}
