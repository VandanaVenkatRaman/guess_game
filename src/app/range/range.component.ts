import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Options, LabelType } from 'ngx-slider-v2';
import { FunctionalityService } from '../functionality.service';
import  'bootstrap-slider';
import  * as $ from 'jquery';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';


const USERS_KEY = 'DBM_USERS';

@Component({
  selector: 'app-range',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.8,
        backgroundColor: 'blue'
      })),
      transition('* => closed', [
        animate('2s')
      ]),
      transition('* => open', [
        animate('1s', keyframes([
          style({ backgroundColor: 'blue' }),
          style({ backgroundColor: 'red' }),
          style({ backgroundColor: 'orange' })
        ]))
      ]),
    ]),
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
    ])
  ],
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent {
  isOpen = true;

  
  range = 0;
  sliderValue = 15000;
  value = 123;
  clueLeft = false;
  answerVisible = false;
  record:any;
  rangeLists!: any[];
  recIndex = 0;
  options!: Options ;
  time: number = 0;
  display:any;
  interval: any;
  isLogo = true;
  playerList!:any[];
  currentParticipants!:any[];
  users!: any;


  navData = {
    screen: 'range',
    rightDisable: false,
    leftDisable: true,
    startHide: true,
    revealHide: false,
    rightHide: false,
    leftHide: false,
    resetHide: true,
    revealDisable: false,
    rowNum: 1
  }
  
  constructor(private functionalityService: FunctionalityService ){
    this.playerList = [];
    this.users= this.functionalityService.getObject(USERS_KEY)
  }


  ngOnInit() {
    this.rangeLists = this.functionalityService.getGameData().rangeGames;
    this.record = this.rangeLists[this.recIndex];
    console.log(this.record.initValue)
    this.startTimer()
    this.getCurrentParticipants(this.recIndex);
    this.functionalityService.aClickedEvent.subscribe((data: any) => {
        if(data.screen === 'range'){
          switch(data.action){
            case 'next':
              if(this.recIndex < this.rangeLists.length - 1){
                this.recIndex += 1;
              }else{
                this.recIndex = 0;
              }
              this.record = this.rangeLists[this.recIndex];
              this.refreshOptions(this.record)
              break;
            case 'previous':
              if(this.recIndex === 0){
                this.recIndex = this.rangeLists.length - 1;
              }else{
                this.recIndex  -= 1;
              }
              this.record = this.rangeLists[this.recIndex];
              this.refreshOptions(this.record)
              break;
            case 'reveal':
                this.revealAnswer();
                break;
            case 'hint':
                this.hint();
                break;
            case 'timer':
                this.startTimer();
                break;
          }

          this.navData.leftDisable= false;
          this.navData.rightDisable= false;

          this.navData.rowNum = this.recIndex + 1;
          this.getCurrentParticipants(this.recIndex)

          if(this.recIndex  === this.rangeLists.length - 1){
            this.navData.rightDisable = true;
            this.navData.leftDisable= false;
          }
          if(this.recIndex  === 0){
            this.navData.rightDisable = false;
            this.navData.leftDisable= true;
          }
        }
      });
  }


  toggle() {
    this.isOpen = !this.isOpen;
  }
  ngAfterViewInit(){
    const opts = {
        tooltip: 'show',
        step: 1,
        min: 200,
        max: 500,
        value: 246,
        formatter: function (value:any) {
            return '$ ' + value;
        },
        ticks: [200, 500],
        ticks_labels: ['$ ' + 200, '$ ' + 500]
    };
    $("#range-2").slider({ ...opts });
  }

  revealAnswer(){
    if(this.record.initValue === this.record.answerValue){
      this.answerVisible = true;
      this.functionalityService.aPopUpEvent.emit({
        screen:"",
        action: 'right'
      })
    }else{
      this.functionalityService.aPopUpEvent.emit({
        screen:"",
        action: 'wrong'
      })
    }
  }

  hint(){
    if(this.record.initValue > this.record.answerValue){
      this.clueLeft = true
    }
    setTimeout(()=> { this.clueLeft = false}, 2000)
    
  }

  refreshOptions(record:any){
    this.answerVisible = false;
    this.startTimer();
    this.isLogo = true;
  }

  formatLabel(value: number): string {
    return `$${value}`;
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
       const parsedVal = minutes + ':' + `${((value - minutes * 60) < 10)? ('0' + (value - minutes * 60)) : (value - minutes * 60)}`
       return parsedVal;
  }
  pauseTimer() {
    clearInterval(this.interval);
  }

  onLogoClick(){
    this.isLogo = false;
  }

  getCurrentParticipants(index: any){
    switch(index){
      case 0: this.currentParticipants = this.users.slice(0,6);
        break;
      case 1: this.currentParticipants = this.users.slice(6,12);
        break;
      case 2: this.currentParticipants = this.users.slice(12,18);
        break;
      case 3: this.currentParticipants = this.users.slice(18,23);
        break;
    }

    console.log(this.currentParticipants)
  }
}
