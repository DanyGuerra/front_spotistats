import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-track-list-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './track-list-skeleton.component.html',
  styleUrls: ['./track-list-skeleton.component.less'],
})
export class TrackListSkeletonComponent {
  @Input() showBorder: boolean = false;
  @Input() index!: number;
}
