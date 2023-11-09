import { Component, Input } from '@angular/core';
import { FunctionalityService } from '../functionality.service';



const SCREEN_VALUES = {
  '/': 'bidding',
  '/bidding': 'bidding',
  '/range': 'range',
  '/shopping': 'shopping',
  '/golf': 'golf',
  '/mystery': 'mystery'
  }

  interface navData {
    screen: string;
    startDisabled?: boolean;
    rightDisable: boolean;
    leftDisable: boolean;
    startHide: boolean;
    revealHide: boolean;
    rightHide?: boolean;
    leftHide?: boolean;
    resetHide?: boolean;
    revealDisable: boolean;
    rowNum: number;
    rowNumHide: boolean;
    clapsHide: boolean;
    AudioHide: boolean;
  }

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
  currentPath = '/';

  @Input()  navData!: navData;
  

  constructor(private functionalityService: FunctionalityService){
    
  }

  ngOnInIt(){
  }

  previous(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'previous'
    });
  }

  next(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'next'
    });
  }

  reveal(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'reveal'
    });
  }
  
  hint(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'hint'
    });
  }

  claps(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'claps'
    });
  }

  timer(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'timer'
    });
  }

  start(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'play'
    });
  }

  reset(){
    this.currentPath = window.location.pathname
    this.functionalityService.AClicked({
      screen: SCREEN_VALUES[this.currentPath  as keyof typeof SCREEN_VALUES],
      action: 'reset'
    });
  }
  playAudio(){
    this.functionalityService.playAudio("/assets/sounds/Washington Blvd.m4a");
  }
}
