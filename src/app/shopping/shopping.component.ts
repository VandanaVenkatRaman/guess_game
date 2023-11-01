import { Component } from '@angular/core';
import { FunctionalityService } from '../functionality.service';

const USERS_KEY = 'DBM_USERS';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent {
  shoppingLists!:any[];
  shoppingItem: any;
  recIndex = 0;
  isLogo = true;

  navData = {
    screen: 'bidding',
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

  currentParticipants!:any[];
  users!: any;


  constructor(private functionalityService: FunctionalityService){
    this.users= this.functionalityService.getObject(USERS_KEY).filter((x:any) => x.selected === true);
  }

  ngOnInit(){
    this.shoppingLists = this.functionalityService.getGameData().shoppingList;
    this.shoppingItem = this.shoppingLists[this.recIndex];
    this.getCurrentParticipants(this.recIndex)
    this.functionalityService.aClickedEvent.subscribe((data: any) => {
      if(data.screen === 'shopping'){
        switch(data.action){
          case 'next':
            if(this.recIndex < this.shoppingLists.length - 1){
              this.recIndex += 1;
            }else{
              this.recIndex = 0;
            }
            this.shoppingItem = this.shoppingLists[this.recIndex];
            this.isLogo = true;
            //this.clearValues();
             break;
          case 'previous':
            if(this.recIndex === 0){
              this.recIndex = this.shoppingLists.length - 1;
            }else{
              this.recIndex  -= 1;
            }
            this.shoppingItem = this.shoppingLists[this.recIndex];
            //this.clearValues();
            this.isLogo = true;
             break;
          case 'reveal':
              this.revealAnswer();
               break;
          case 'hint':
              this.hint();
               break;
        }

        this.navData.rowNum = this.recIndex + 1;

        this.getCurrentParticipants(this.recIndex)


        if(this.recIndex  === this.shoppingLists.length - 1){
          this.navData.rightDisable = true;
          this.navData.leftDisable= false;
        }
        if(this.recIndex  === 0){
          this.navData.rightDisable = false;
          this.navData.leftDisable= true;
        }
      }
    })
  }

  revealAnswer(){
    console.log('working')
    let foundWinner = false;
    this.shoppingItem.alternatives.forEach((x:any) => {
      if(x.isSelected && x.isCorrect){
        x.isWinner = true;
        foundWinner = true
      }
      else if(x.isSelected)
        x.isWrong = true;
      else if(foundWinner){
        x.isWrong = true;
      }

    })

    if(foundWinner){
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "right"
      })
    }else{
      this.functionalityService.aPopUpEvent.emit({
        screen: "",
        action: "wrong"
      })
    }
  }

  hint(){

  }

  onClick(i: any){
    this.shoppingItem.alternatives[i].isSelected === true ? this.shoppingItem.alternatives[i].isSelected = false: this.shoppingItem.alternatives[i].isSelected = true;
  }

  onLogoClick(){
    this.isLogo = false;
  }

  getCurrentParticipants(index: any){
    switch(index){
      case 0: this.currentParticipants = this.users.slice(0,2);
        break;
      case 1: this.currentParticipants = this.users.slice(2,4);
        break;
    }
    console.log(this.currentParticipants)
  }
}
