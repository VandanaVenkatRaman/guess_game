import { EventEmitter, Injectable, Output } from '@angular/core';
import * as gameData from '../assets/data/mainData.json'

const USERS_KEY = 'DBM_USERS';

interface actionInterface {
    screen: string;
    action: string;
    index?: number;
}

@Injectable({
  providedIn: 'root'
})

export class FunctionalityService {

  @Output() aClickedEvent = new EventEmitter<actionInterface>();
  @Output() aPopUpEvent = new EventEmitter<actionInterface>();
  @Output() anIndexChangeEvent = new EventEmitter<actionInterface>();




  constructor() { }
  
  getGameData(){
    return gameData;
  }

  setObject(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getObject(key: any) {
    const item = localStorage.getItem(key);
    return !!item? JSON.parse(item) : null;
  }

  AClicked(msg: actionInterface) {
    this.aClickedEvent.emit(msg);
  }

  APopUp(msg: actionInterface) {
    this.aPopUpEvent.emit(msg);
  }

  AnIndexChangeEvent(msg: actionInterface) {
    this.anIndexChangeEvent.emit(msg);
  }

  playAudio(path: string){
    let audio = new Audio();
    audio.src = path;
    audio.load();
    audio.play();
  }

}
