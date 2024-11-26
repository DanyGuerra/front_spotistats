import { generateRandomWidth } from './../../../../../../utils/general-utils';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recently-played-list-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './recently-played-list-skeleton.component.html',
  styleUrls: ['./recently-played-list-skeleton.component.less'],
})
export class RecentlyPlayedListSkeletonComponent {
  @Input() totalSkeletonItems: number = 0;
  generateRandomWidth = generateRandomWidth;

  get iterationsArray(): number[] {
    return Array(this.totalSkeletonItems).fill(0);
  }
}
