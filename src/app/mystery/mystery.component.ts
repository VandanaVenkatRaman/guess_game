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
  templateUrl: './mystery.component.html',
  styleUrls: ['./mystery.component.scss']
})
export class MysteryComponent {
  record!: any;
  mysteryGames!: any[];
  answerVisible = false;
  time: number = 0;
  display:any;
  interval: any;

  value4 = 1344;
  recIndex = 0;
  pictureVisible = true;

  
  navData = {
    screen: 'bidding',
    rightDisable: false,
    leftDisable: true,
    startHide: false,
    revealHide: false
  }

  constructor(private functionalityService: FunctionalityService ){
  }
  ngOnInit() {
    this.mysteryGames = this.functionalityService.getGameData().mystery;
    this.record = this.mysteryGames[this.recIndex];
    this.startTimer();

  this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if(data.screen === 'mystery'){
        debugger;
        switch(data.action){
          case 'next':
            if(this.recIndex < this.mysteryGames.length - 1){
              this.recIndex += 1;
            }else{
              this.recIndex = 0;
            }
            this.record = this.mysteryGames[this.recIndex];
            this.clearValues();
             break;
          case 'previous':
            if(this.recIndex === 0){
              this.recIndex = this.mysteryGames.length - 1;
            }else{
              this.recIndex  -= 1;
            }
            this.record = this.mysteryGames[this.recIndex];
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

        if(this.recIndex  === this.mysteryGames.length - 1){
          this.navData.rightDisable = true;
          this.navData.leftDisable= false;
        }
        if(this.recIndex  === 0){
          this.navData.rightDisable = false;
          this.navData.leftDisable= true;
        }
      }
    })

    setTimeout(()=> {this.pictureVisible = false}, 2000)
  }

  revealAnswer(){
    this.answerVisible = true;
    this.pictureVisible = true;
  }



  clearValues(){
    this.answerVisible = false;
    this.pictureVisible = true;
    this.startTimer();
    setTimeout(()=> {this.pictureVisible = false}, 2000)
  }

  startTimer() {
    if(this.time > 0){
      clearInterval(this.interval);
      this.time = 0
      this.display=''
    }
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display=this.transform( this.time)
    }, 1000);
  }
  transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       return minutes + ':' + (value - minutes * 60);
  }
  pauseTimer() {
    clearInterval(this.interval);
  }


  @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const key = parseInt(event.key);
    if([1,2,3,4,5].includes(key)){
      this.record.guessList[key-1].isEnabled = true;
    }
  }

}
