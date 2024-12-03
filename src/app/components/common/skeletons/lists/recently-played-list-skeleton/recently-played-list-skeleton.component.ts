import { generateRandomWidth } from './../../../../../../utils/general-utils';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recently-played-list-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './recently-played-list-skeleton.component.html',
  styleUrls: ['./recently-played-list-skeleton.component.less'],
})
export class RecentlyPlayedListSkeletonComponent implements OnInit {
  @Input() showBorder: boolean = false;
  skeletonWidths: string[] = [];
  generateRandomWidth = generateRandomWidth;

  ngOnInit(): void {
    this.skeletonWidths = [
      this.generateRandomWidth(30, 80),
      this.generateRandomWidth(10, 30),
      this.generateRandomWidth(50, 100),
    ];
  }
}
