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
  animations: [trigger(
    'pulse', [
    state('false', style({ opacity: 1, backgroundColor: 'transparent' })),
    state('true', style({ opacity: 1, background: 'linear-gradient(0deg, rgb(232, 68, 22) 0%, rgb(221, 232, 125) 100%)' })),
    transition('false=>true', [
      animate('1s', keyframes([
        style({ opacity: 0, backgroundColor: 'blue' }),
        style({ opacity: 0.5, backgroundColor: 'yellow' }),
        style({ opacity: 1, backgroundColor: 'white' }),
        style({ opacity: 0.5, backgroundColor: 'blue' }),
        style({ opacity: 1, backgroundColor: 'red' }),
        style({ opacity: 0.2, backgroundColor: 'orange' }),
        style({ opacity: 0.5, backgroundColor: 'blue' }),
        style({ opacity: 0.8, backgroundColor: 'red' }),
        style({ opacity: 1, backgroundColor: 'orange' })
      ]))
    ])
  ]
  ),
  trigger('blinkInput', [
    state('false', style({ opacity: 1 })),
    state('true', style({ opacity: 1 })),
    transition('false => true', animate('1s ease-in-out', keyframes([
      style({ opacity: 0, offset: 0 }),
      style({ opacity: 1, offset: 0.2 }),
      style({ opacity: 0, offset: 0.4 }),
      style({ opacity: 1, offset: 0.6 }),
      style({ opacity: 0, offset: 0.8 }),
      style({ opacity: 1, offset: 1 })
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
  isLogo = true;
  isRow = true;
  subscription!: any;

  record: any;
  users: any[] = [];

  navData = {
    screen: 'golf',
    startDisabled: false,
    rightDisable: true,
    leftDisable: true,
    rightHide: true,
    leftHide: true,
    startHide: false,
    revealHide: false,
    resetHide: false,
    revealDisable: false,
    rowNum: 1,
    rowNumHide: true,
    clapsHide: false,
    AudioHide: true,
    expandHide: true
  }

  constructor(private functionalityService: FunctionalityService) {
    this.navData.revealDisable = true;
  }

  ngOnInit() {
    this.record = this.functionalityService.getGameData().golf[0];

    this.functionalityService.getObject(USERS_KEY).forEach(
      (x: any) => {
        if (x.isWinner && !x.isLost) {
          this.users.push(x)
        }
      }
    );
    this.users = this.users.splice(0, 2)

    console.log(this.users)

    this.subscription = this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if (data.screen === 'golf') {
        switch (data.action) {
          case 'reset':
            this.reset();
            break;
          case 'reveal':
            this.reveal();
            break;
          case 'play':
            this.play();
            break;
        }

        this.emitIndexChange();
      }
    })
  }

  ngAfterViewInit() {
    this.emitIndexChange();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  togglePulsating(box: any) {
    switch (box) {
      case 'q':
      case 'Q':
        //this.isPulsating1 = !this.isPulsating1
        break;
      case 'w':
      case 'W':
        this.isPulsating2 = !this.isPulsating2
        break;
      case 'e':
      case 'E':
        this.isPulsating3 = !this.isPulsating3
        break;
      case 'r':
      case 'R':
        this.isPulsating4 = !this.isPulsating4
        break;
      case 't':
      case 'T':
        this.isPulsating5 = !this.isPulsating5
        break;
      case 'y':
      case 'Y':
        this.isPulsating6 = !this.isPulsating6
        break;
      case 'u':
      case 'U':
        this.isPulsating7 = !this.isPulsating7
        break;
    }
  }

  emitIndexChange() {

    this.functionalityService.anIndexChangeEvent.emit({
      screen: 'golf',
      action: 'nav',
      index: 0,
      isRow: this.isRow,
      isLogo: this.isLogo
    })
  }

  @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event.key)
    if (['q', 'w', 'e', 'r', 't', 'y', 'u'].includes(event.key) ||
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U'].includes(event.key)) {

      this.togglePulsating(event.key)
    }
  }

  inputChange(user: any, val: string) {

    user.value4 = (!!user.value1 ? user.value1 : 0) + (!!user.value2 ? user.value2 : 0) + (!!user.value3 ? user.value3 : 0);
    user.value4 = Number(user.value4).toLocaleString()

    console.log(this.checkInputs());

    if (this.users.length > 0) {
      if ((this.users[0].value4 === this.users[1].value4) || !this.checkInputs()) {
        this.navData.revealDisable = true;
      } else {
        this.navData.revealDisable = false;
      }
    }
  }

  checkInputs() {
    if (this.users.length > 0) {
      const u1 = this.users[0];
      const u2 = this.users[1];
      const hasAllU1 = typeof u1.value1 === 'number' && typeof u1.value2 === 'number' && typeof u1.value3 === 'number'
      const hasAllU2 = typeof u2.value1 === 'number' && typeof u2.value2 === 'number' && typeof u2.value3 === 'number'

      return hasAllU1 && hasAllU2
    }
    return false;
  }

  reset() {
    this.users.forEach(x => {
      x.value1 = null,
        x.value2 = null,
        x.value3 = null,
        x.value4 = null,
        x.isWinner = false
    })
    this.isRevealed = false;
  }

  async reveal() {
    debugger

    this.functionalityService.AClicked({ action: 'heartbeat', screen: 'golf' });

    this.functionalityService.aPopUpEvent.emit({ screen: 'countdown-golf', action: '5' });
    await new Promise(resolve => setTimeout(resolve, 1000 * 1))

    this.functionalityService.aPopUpEvent.emit({ screen: 'countdown-golf', action: '4' });
    await new Promise(resolve => setTimeout(resolve, 1000 * 1))

    this.functionalityService.aPopUpEvent.emit({ screen: 'countdown-golf', action: '3' });
    await new Promise(resolve => setTimeout(resolve, 1000 * 1))

    this.functionalityService.aPopUpEvent.emit({ screen: 'countdown-golf', action: '2' });
    await new Promise(resolve => setTimeout(resolve, 1000 * 1))

    this.functionalityService.aPopUpEvent.emit({ screen: 'countdown-golf', action: '1' });
    await new Promise(resolve => setTimeout(resolve, 1000 * 1))

    if (this.users.length > 0) {
      const u1 = Math.abs(this.users[0].value4 - this.record.answerValue)
      const u2 = Math.abs(this.users[1].value4 - this.record.answerValue)

      const winnerIdx = u1 < u2 ? 0 : 1;

      this.users[winnerIdx].isWinner = true;

      this.functionalityService.aPopUpEvent.emit({
        screen: 'golf',
        action: 'right',
        secondArg: this.users[winnerIdx].val
      });

      this.isRevealed = true;
    }
  }

  play() {
    this.isRow = false;
    this.reset();
  }

  onLogoClick() {
    this.isLogo = false;
    this.reset();

    this.emitIndexChange();
  }
}