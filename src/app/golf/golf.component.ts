import { Component, HostListener } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { FunctionalityService } from '../functionality.service';

const USERS_KEY = 'DBM_USERS';

@Component({
  selector: 'app-golf',
  animations:[trigger(
    'pulse',[
     state('false', style({ opacity: 1, backgroundColor: 'transparent'})),
     state('true', style({ opacity: 1,  background: 'linear-gradient(0deg, rgb(232, 68, 22) 0%, rgb(221, 232, 125) 100%)' })),
      transition('false=>true', [
        animate('1s', keyframes([
          style({opacity: 0, backgroundColor: 'blue'}),
          style({opacity: 0.5, backgroundColor: 'yellow'}),
          style({opacity: 1, backgroundColor: 'white'}),
          style({ opacity: 0.5,backgroundColor: 'blue' }),
          style({ opacity: 1,backgroundColor: 'red' }),
          style({ opacity: 0.2,backgroundColor: 'orange' }),
          style({ opacity: 0.5,backgroundColor: 'blue' }),
          style({ opacity: 0.8,backgroundColor: 'red' }),
          style({ opacity: 1,backgroundColor: 'orange' })
        ]))
      ])
    ]
  ),
  trigger('blinkInput', [
    state('false', style({ opacity: 0 })),
    state('true', style({ opacity: 1 })),
    transition('false => true', animate('1s ease-in-out', keyframes([
      style({opacity:0, offset: 0 }),
      style({opacity:1, offset: 0.2 }),
      style({opacity:0, offset: 0.4 }),
      style({opacity:1, offset: 0.6 }),
      style({opacity:0, offset: 0.8 }),
      style({opacity:1, offset: 1 })
    ])))
  ])],
  templateUrl: './golf.component.html',
  styleUrls: ['./golf.component.scss']
})
export class GolfComponent {
  isPulsating1 = false;
  isPulsating2 = false;
  isPulsating3 = false;
  isPulsating4 = false;
  isPulsating5 = false;
  isPulsating6 = false;
  isPulsating7 = false;
  isRevealed = false;

  record: any;
  users:any[] = [];

  constructor(private functionalityService: FunctionalityService){

  }

  ngOnInit(){
    this.record = this.functionalityService.getGameData().golf[0];
    //this.users = this.functionalityService.getObject(USERS_KEY);
    this.functionalityService.getObject(USERS_KEY).forEach(
      (x:any) =>{
        if(x.selected){
          this.users.push(x)
        }
      } 
    );
    this.users = this.users.splice(0,2)
    console.log(this.users)
  }

  togglePulsating(box:any){
    switch(box){
      case 'q': 
      this.isPulsating1 = !this.isPulsating1 
      break;
      case 'w':
        this.isPulsating2 = !this.isPulsating2
      break;
      case 'e':
        this.isPulsating3 = !this.isPulsating3
      break;
      case 'r':
        this.isPulsating4 = !this.isPulsating4
      break;
      case 't':
        this.isPulsating5 = !this.isPulsating5
      break;
      case 'y':
        this.isPulsating6 = !this.isPulsating6
      break;
      case 'u':
        this.isPulsating7 = !this.isPulsating7
      break;
    }
  }

  @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event.key)
    if(['q','w','e','r','t','y','u'].includes(event.key)){
      
      this.togglePulsating(event.key)
    }
  }

  inputChange(user: any, val: string){
    // console.log(user)
    // debugger;
    // switch(val){
    //   case 'val1':
    //     if(!![1,2,3,4,5,6,7].includes(user.value1)){
    //       user.value1 = user.value1*100;
    //     }
    //   break;
    //   case 'val2':
    //     if(!![1,2,3,4,5,6,7].includes(user.value2)){
    //       user.value2 = user.value2*100;
    //     } 
    //   break;
    //   case 'val3':
    //     if(!![1,2,3,4,5,6,7].includes(user.value3)){
    //       user.value3 = user.value3*100;
    //     }  
    //   break;
    // }
    user.value4 = (!!user.value1? user.value1: 0) + (!!user.value2? user.value2: 0) + (!!user.value3? user.value3: 0);

    if(this.record.answerValue === user.value4){
      user.isWinner = true;
      this.functionalityService.aPopUpEvent.emit({
        screen: '',
        action: 'right'
      })
      this.isRevealed = true;
    }
  }

}
