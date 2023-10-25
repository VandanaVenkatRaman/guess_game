import { Component } from '@angular/core';
import { FunctionalityService } from '../functionality.service';



const SCREEN_VALUES = {
  '/': 'bidding',
  '/bidding': 'bidding',
  '/range': 'range',
  '/shopping': 'shopping',
  '/golf': 'golf',
  '/mystery': 'mystery'
  }

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
  currentPath = '/';
  

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
}
