import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { FunctionalityService } from '../functionality.service';

@Component({
  selector: 'app-mystery',
  animations: [
    trigger('blink', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('* <=> *', animate('1s ease-in-out', keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 0.2 }),
        style({ opacity: 0, offset: 0.4 }),
        style({ opacity: 1, offset: 0.6 }),
        style({ opacity: 0, offset: 0.8 }),
        style({ opacity: 1, offset: 1 })
      ])))
    ]),
    trigger('blinkInput', [
      state('false', style({ opacity: 1 })),
      state('true', style({ opacity: 1 })),
      transition('false <=> true', animate('1s ease-in-out', keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 0.2 }),
        style({ opacity: 0, offset: 0.4 }),
        style({ opacity: 1, offset: 0.6 }),
        style({ opacity: 0, offset: 0.8 }),
        style({ opacity: 1, offset: 1 })
      ])))
    ])
  ],
  templateUrl: './mystery.component.html',
  styleUrls: ['./mystery.component.scss']
})
export class MysteryComponent {
  record!: any;
  mysteryGames!: any[];
  answerVisible = false;
  time: number = 0;
  display: any;
  interval: any;

  isRow = true;
  value4 = 1344;
  recIndex = 0;
  pictureVisible = false;
  seatingList!: any[];
  isLogo = true;
  // crossMark = false;
  // buzzerSounds = {
  //   "WrongAnswer": "/assets/sounds/wah-wah-sad-trombone-6347.mp3",
  // }

  navData = {
    screen: 'bidding',
    rightDisable: false,
    leftDisable: true,
    startHide: false,
    revealHide: false,
    rightHide: false,
    leftHide: false,
    resetHide: true,
    revealDisable: false,
    rowNum: 1,
    rowNumHide: false,
    clapsHide: false,
    AudioHide: true,
    expandHide: true
  }

  constructor(private functionalityService: FunctionalityService) {
  }
  ngOnInit() {
    this.mysteryGames = this.functionalityService.getGameData().mystery;
    this.seatingList = this.functionalityService.getGameData().seatingMystery;
    this.record = this.seatingList[this.recIndex];

    this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if (data.screen === 'mystery') {
        ;
        switch (data.action) {
          case 'next':
            if (this.recIndex < this.seatingList.length - 1) {
              this.recIndex += 1;
            } else {
              this.recIndex = 0;
            }
            this.record = this.seatingList[this.recIndex];
            this.clearValues();
            break;
          case 'previous':
            if (this.recIndex === 0) {
              this.recIndex = this.seatingList.length - 1;
            } else {
              this.recIndex -= 1;
            }
            this.record = this.seatingList[this.recIndex];
            this.clearValues();
            break;
          case 'reveal':
            this.revealAnswer();
            break;
          case 'timer':
            this.startTimer();
            break;
          case 'play':
            this.play();
            break;
          case 'reset':
            this.reset();
            break;
        }

        this.navData.rowNum = this.recIndex + 1;

        if (this.recIndex === this.seatingList.length - 1) {
          this.navData.rightDisable = true;
          this.navData.leftDisable = false;
        }
        if (this.recIndex === 0) {
          this.navData.rightDisable = false;
          this.navData.leftDisable = true;
        }
      }
    })
  }

  revealAnswer() {
    this.answerVisible = true;
    this.pictureVisible = true;
    this.functionalityService.aPopUpEvent.emit({
      screen: "",
      action: "right"
    })
  }
  clearValues() {
    this.answerVisible = false;
    clearInterval(this.interval);
    this.time = 0;
    this.isRow = true;
    this.pictureVisible = false;
    // setTimeout(()=> {this.pictureVisible = false}, 2000)
  }

  startTimer() {
    if (this.time > 0) {
      clearInterval(this.interval);
      this.time = 0
      this.display = '';
    }
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time)
    }, 1000);
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const parsedVal = minutes + ':' + `${((value - minutes * 60) < 10) ? ('0' + (value - minutes * 60)) : (value - minutes * 60)}`
    return parsedVal;
  }
  pauseTimer() {
    clearInterval(this.interval);
  }


  @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const key = parseInt(event.key);
    if ([1, 2, 3, 4, 5].includes(key)) {
      this.record.guessList[key - 1].isEnabled = true;
    }
  }

  play() {
    this.record = this.mysteryGames[this.recIndex]
    this.isRow = false;
    // this.startTimer()
    this.pictureVisible = false;
    this.reset();
  }

  onLogoClick() {
    this.isLogo = false;
  }

  mysterReveal(item: any) {
    item.isEnabled = true;
  }
  reset() {
    this.record.guessList.forEach((x: any) => {
      x.isEnabled = false;
    });
    this.pictureVisible = false;
    this.startTimer()
  }

}
