import { Component } from '@angular/core';
import { FunctionalityService } from '../functionality.service';

const USERS_KEY = 'DBM_USERS';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent {
  shoppingLists!: any[];
  shoppingItem: any;
  recIndex = 0;
  isLogo = true;
  isRow = true;
  shoppingListSeating: any;
  record!: any;
  subscription!: any;

  navData = {
    screen: 'shopping',
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

  currentParticipants!: any[];
  users!: any;


  constructor(private functionalityService: FunctionalityService) {
    this.users = this.functionalityService.getObject(USERS_KEY).filter((x: any) => x.isWinner === true);
    this.recIndex = 0;
  }

  ngOnInit() {
    this.recIndex = 0;

    this.shoppingLists = this.functionalityService.getGameData().shoppingList;
    this.shoppingItem = this.shoppingLists[this.recIndex];
    this.shoppingListSeating = this.functionalityService.getGameData().shoppingListSeating;
    this.getCurrentParticipants(this.recIndex)
    this.record = this.shoppingListSeating[this.recIndex];

    this.subscription = this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if (data.screen === 'shopping') {
        switch (data.action) {
          case 'next':
            if (this.recIndex < this.shoppingListSeating.length - 1) {
              this.recIndex += 1;
            } else {
              this.recIndex = 0;
            }
            this.record = this.shoppingListSeating[this.recIndex];
            this.reset();
            this.isRow = true;

            break;
          case 'previous':

            if (this.recIndex === 0) {
              this.recIndex = this.shoppingListSeating.length - 1;
            } else {
              this.recIndex -= 1;
            }
            this.record = this.shoppingListSeating[this.recIndex];
            this.reset();
            this.isRow = true;

            break;
          case 'reveal':
            this.revealAnswer();
            break;
          case 'hint':
            this.hint();
            break;
          case 'reset':
            this.reset();
            break;
          case 'play':
            this.play();
            break;
        }
        this.navData.rowNum = this.recIndex + 1;
        this.getCurrentParticipants(this.recIndex)

        this.navData.rightDisable = false;
        this.navData.leftDisable = false;

        if (this.recIndex === this.shoppingLists.length - 1) {
          this.navData.rightDisable = true;
          this.navData.leftDisable = false;
        }
        if (this.recIndex === 0) {
          this.navData.rightDisable = false;
          this.navData.leftDisable = true;
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

  emitIndexChange() {
    this.functionalityService.anIndexChangeEvent.emit({
      screen: 'shopping',
      action: 'nav',
      index: this.recIndex,
      isRow: this.isRow,
      isLogo: this.isLogo
    })
  }

  revealAnswer() {
    console.log('working')
    let foundWinner = false;
    this.shoppingItem.alternatives.forEach((x: any) => {
      if (x.isSelected && x.isCorrect) {
        x.isWinner = true;
        foundWinner = true
      }
      else if (x.isSelected)
        x.isWrong = true;
    })

    if (foundWinner) {
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "right"
      })

      this.shoppingItem.alternatives.forEach((x: any) => {
        if (x.isSelected && x.isCorrect) {
          x.isWinner = true;
        }
        else
          x.isWrong = true;
      })

    } else {
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "wrong"
      })
    }
  }

  hint() {

  }
  play() {
    this.shoppingItem = this.shoppingLists[this.recIndex];
    this.isRow = false;
    // this.startTimer()
    this.reset();

    this.emitIndexChange();
  }

  onClick(i: any) {
    this.shoppingItem.alternatives[i].isSelected === true ? this.shoppingItem.alternatives[i].isSelected = false : this.shoppingItem.alternatives[i].isSelected = true;
  }
  reset() {

    this.shoppingItem.alternatives.forEach((x: any) => {
      x.isWinner = false;
      x.isWrong = false;
      x.isSelected = false;
    })
  }

  onLogoClick() {
    this.isLogo = false;
    this.reset();
    this.emitIndexChange();
  }

  getCurrentParticipants(index: any) {
    switch (index) {
      case 0:
        this.currentParticipants = [this.users[0], this.users[1]];
        break;
      case 1:
        this.currentParticipants = [this.users[this.users.length - 2], this.users[this.users.length - 1]];
        break;
    }
    console.log(this.currentParticipants)
  }
}
