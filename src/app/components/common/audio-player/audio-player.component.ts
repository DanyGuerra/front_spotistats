import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClickOutsideDirective } from 'src/app/directives/click-outside.directive';
import { IconPlayComponent } from '../icons/icon-play/icon-play.component';
import { IconPauseComponent } from '../icons/icon-pause/icon-pause.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ClickOutsideDirective,
    IconPlayComponent,
    IconPauseComponent,
  ],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.less'],
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  @Input() urlPreview!: string;
  isPlaying: boolean = false;

  audioDuration: number = 0;
  currentTime: number = 0;

  constructor(private toastService: ToastService) {}

  private loadedMetadataListener = () => {
    this.audioDuration = this.audioRef.nativeElement.duration;
  };

  private timeUpdateListener = () => {
    this.currentTime = this.audioRef.nativeElement.currentTime;
  };

  private endedListener = () => {
    this.isPlaying = false;
  };

  ngAfterViewInit() {
    this.audioRef.nativeElement.addEventListener(
      'loadedmetadata',
      this.loadedMetadataListener
    );
    this.audioRef.nativeElement.addEventListener(
      'timeupdate',
      this.timeUpdateListener
    );
    this.audioRef.nativeElement.addEventListener('ended', this.endedListener);
  }

  ngOnDestroy() {
    this.audioRef.nativeElement.removeEventListener(
      'loadedmetadata',
      this.loadedMetadataListener
    );
    this.audioRef.nativeElement.removeEventListener(
      'timeupdate',
      this.timeUpdateListener
    );
    this.audioRef.nativeElement.removeEventListener(
      'ended',
      this.endedListener
    );
  }

  playAudio() {
    if (this.urlPreview) {
      this.audioRef.nativeElement.play();
      this.isPlaying = true;
    } else {
      this.toastService.showError(
        'Something went wrong',
        'The audio is not available, try later'
      );
    }
  }

  pauseAudio() {
    if (this.urlPreview) {
      this.audioRef.nativeElement.pause();
      this.isPlaying = false;
    }
  }

  stopAudio() {
    if (this.urlPreview) {
      this.audioRef.nativeElement.pause();
      this.audioRef.nativeElement.currentTime = 0;
      this.isPlaying = false;
    }
  }

  onClickedOutside() {
    this.isPlaying = false;
    this.audioRef.nativeElement.pause();
  }
}
