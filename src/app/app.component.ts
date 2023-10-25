import { Component } from '@angular/core';
import { FunctionalityService } from './functionality.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PartyTime';
  test = [{}];

  constructor(private functionalityService: FunctionalityService){

  }

  ngOnInit() {
    console.log(this.functionalityService.getGameData());
    this.test = this.functionalityService.getGameData().biddingGames; 
  }
}
