import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-track-card-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './track-card-skeleton.component.html',
  styleUrls: ['./track-card-skeleton.component.less'],
})
export class TrackCardSkeletonComponent {}
