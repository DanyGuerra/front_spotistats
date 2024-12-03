import { generateRandomWidth } from './../../../../../../utils/general-utils';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-artist-list-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './artist-list-skeleton.component.html',
  styleUrls: ['./artist-list-skeleton.component.less'],
})
export class ArtistListSkeletonComponent implements OnInit {
  @Input() index: number | null = null;
  skeletonWidths: string[] = [];
  generateRandomWidth = generateRandomWidth;

  ngOnInit(): void {
    this.skeletonWidths = [this.generateRandomWidth(15, 100)];
  }
}
