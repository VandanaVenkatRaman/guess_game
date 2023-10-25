import { Component } from '@angular/core';
import { FunctionalityService } from '../functionality.service';
import * as $ from "jquery";
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

let numInputs = [{id:0, isWinner: false, isDisabled: false}]
@Component({
  selector: 'app-bidding',
  animations: [
    trigger('blink', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false <=> true', animate('1s ease-in-out', keyframes([
        style({opacity:0, offset: 0 }),
        style({opacity:1, offset: 0.2 }),
        style({opacity:0, offset: 0.4 }),
        style({opacity:1, offset: 0.6 }),
        style({opacity:0, offset: 0.8 }),
        style({opacity:1, offset: 1 })
      ])))
    ]),
    trigger('blinkInput', [
      state('false', style({ opacity: 1 })),
      state('true', style({ opacity: 1 })),
      transition('false <=> true', animate('1s ease-in-out', keyframes([
        style({opacity:0, offset: 0 }),
        style({opacity:1, offset: 0.2 }),
        style({opacity:0, offset: 0.4 }),
        style({opacity:1, offset: 0.6 }),
        style({opacity:0, offset: 0.8 }),
        style({opacity:1, offset: 1 })
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
  display:any;
  interval: any;

  value4 = 1344;
  recIndex = 0;

  constructor(private functionalityService: FunctionalityService ){
    this.numInputs = Array(15).fill(1).map((x, i) => i + 1);
  }
  ngOnInit() {
    this.biddingGames = this.functionalityService.getGameData().biddingGames;
    this.biddingValues = this.functionalityService.getGameData().biddingInputs;
    console.log(this.biddingValues[0].id)
    this.record = this.biddingGames[this.recIndex];

  this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if(data.screen === 'bidding'){
        switch(data.action){
          case 'next':
            if(this.recIndex < this.biddingGames.length - 1){
              this.recIndex += 1;
            }else{
              this.recIndex = 0;
            }
            debugger;
            this.record = this.biddingGames[this.recIndex];
            this.clearValues();
             break;
          case 'previous':
            if(this.recIndex === 0){
              this.recIndex = this.biddingGames.length - 1;
            }else{
              this.recIndex  -= 1;
            }
            this.record = this.biddingGames[this.recIndex];
            this.clearValues();
             break;
          case 'reveal':
            debugger;
              this.revealAnswer();
               break;
          case 'timer':
              this.startTimer();
               break;
        }
      }
    })
  }

  revealAnswer(){
    const sortedCandidates = 
    this.biddingValues.filter((x:any) => !!x.value)
      .filter((x:any) => x.value <= this.record.answerValue)
      .sort((x1: any, x2: any) => x2.value - x1.value) 
    
    if (sortedCandidates.length > 0) {
        const maxV = sortedCandidates[0].value
        this.biddingValues.forEach((x:any) => {
          if(x.value === maxV){
            x.isWinner = true;
          }else{
            x.isDisabled = true
          }
        })
      }
      else{
        this.biddingValues.forEach((x:any) => {
          x.isDisabled = true
        })
      }
      this.answerVisible = true;
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "right"
    })
  }



  clearValues(){
    this.biddingValues.forEach(x => {
      x.value = null,
      x.isDisabled = false,
      x.isWinner = false
    });
    this.answerVisible = false;
  }

  startTimer() {
    if(this.time > 0){
      clearInterval(this.interval);
      this.time = 0
      this.display=''
    }
    else{
      this.interval = setInterval(() => {
        if (this.time === 0) {
          this.time++;
        } else {
          this.time++;
        }
        this.display=this.transform( this.time)
      }, 1000);
    }
  }
  transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       return minutes + ':' + (value - minutes * 60);
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
}
