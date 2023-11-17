import { Component } from '@angular/core';
import { FunctionalityService } from '../functionality.service';
import * as $ from "jquery";
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

let numInputs = [{ id: 0, isWinner: false, isDisabled: false }]
@Component({
  selector: 'app-bidding',
  animations: [
    trigger('blink', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false <=> true', animate('1s ease-in-out', keyframes([
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
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.scss']
})
export class BiddingComponent {
  numInputs!: any[];
  record!: any;
  biddingGames!: any[];
  biddingValues!: any[];
  answerVisible = false;
  time: number = 0;
  display: any;
  interval: any;
  seatingList: any;
  isRow = true;

  value4 = 1344;
  recIndex = 0;
  isLogo = true;

  navData = {
    screen: 'bidding',
    startDisabled: true,
    rightDisable: false,
    leftDisable: true,
    startHide: false,
    revealHide: false,
    rightHide: false,
    leftHide: false,
    resetHide: false,
    revealDisable: false,
    rowNum: 1,
    rowNumHide: false,
    clapsHide: false,
    AudioHide: true,
    expandHide: true
  }
  navMainData = {
    screen: 'biddingMain',
    startDisabled: false,
    rightDisable: true,
    leftDisable: true,
    startHide: true,
    revealHide: true,
    rightHide: true,
    leftHide: true,
    resetHide: true,
    revealDisable: false,
    rowNum: 1,
    rowNumHide: true,
    clapsHide: true,
    AudioHide: true,
    expandHide: true
  }

  constructor(private functionalityService: FunctionalityService) {
    this.numInputs = Array(15).fill(1).map((x, i) => i + 1);
  }

  ngOnInit() {
    this.biddingGames = this.functionalityService.getGameData().biddingGames;
    this.seatingList = this.functionalityService.getGameData().seating;
    this.biddingValues = this.functionalityService.getGameData().biddingInputs;
    console.log(this.biddingValues[0].id)
    // this.record = this.biddingGames[this.recIndex];
    this.record = this.seatingList[this.recIndex];
    this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if (data.screen === 'bidding') {
        switch (data.action) {
          case 'next':
            ;
            if (this.recIndex < this.seatingList.length - 1) {
              this.recIndex += 1;
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
            ;
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
        console.log(this.recIndex)
        this.navData.leftDisable = false;
        this.navData.rightDisable = false;
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
      if (data.screen === 'biddingMain') {
        switch (data.action) {
          // case 'play':
          //   this.onMainPlayButtonClick();
          //     break;
          case 'reset':
            this.reset();
            break;
        }
      }

    })
  }

  revealAnswer() {
    const sortedCandidates =
      this.biddingValues.filter((x: any) => !!x.value)
        .filter((x: any) => x.value <= this.record.answerValue)
        .sort((x1: any, x2: any) => x2.value - x1.value)

    const sortedCandidateshigh = this.biddingValues.filter((x: any) => !!x.value)
      .filter((x: any) => x.value > this.record.answerValue)
      .sort((x1: any, x2: any) => x1.value - x2.value)

    console.log(sortedCandidateshigh);

    console.log('sorted candidates', sortedCandidates)

    if (sortedCandidates.length > 0) {
      const maxV = sortedCandidates[0].value
      this.biddingValues.forEach((x: any) => {

        if (x.value === maxV) x.isWinner = true;
        else x.isDisabled = true

      })

      this.answerVisible = true;
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "right"
      })

    } else if (sortedCandidateshigh.length > 0) {

      const maxV = sortedCandidateshigh[0].value
      this.biddingValues.forEach((x: any) => {
        if (x.value === maxV) x.isWinner = true;
        else x.isDisabled = true
      })

      this.answerVisible = true;
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "right"
      })
    }
  }

  clearValues() {
    this.biddingValues.forEach(x => {
      x.value = null,
        x.isDisabled = false,
        x.isWinner = false,
        x.isDuplicate = false
    });
    this.isRow = true;
    this.answerVisible = false;
  }

  startTimer() {
    if (this.time > 0) {
      clearInterval(this.interval);
      this.time = 0
      this.display = ''
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

  play() {
    this.record = this.biddingGames[this.recIndex]
    this.isRow = false;
    // this.startTimer()
    this.reset();
  }
  playAudio() {
    this.functionalityService.playAudio("/assets/sounds/Washington Blvd.m4a");
  }

  checkDups(bidding: any) {
    ;
    console.log(bidding);
    var values = this.biddingValues.map(x => {
      if (x.id !== bidding.id && x.value > 0) {
        return x.value
      }
    });

    console.log(values)

    if (values.includes(bidding.value)) {
      bidding.isDuplicate = true;
    } else {
      bidding.isDuplicate = false;
    }
  }

  reset() {
    this.biddingValues.forEach(x => {
      x.value = null,
        x.isDisabled = false,
        x.isWinner = false,
        x.isDuplicate = false
    });
    this.answerVisible = false;
    this.startTimer();
  }

  onLogoClick() {
    this.isLogo = false;
  }
}
