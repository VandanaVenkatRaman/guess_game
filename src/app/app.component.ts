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
  isLogo = true;

  constructor(private functionalityService: FunctionalityService){

  }

  ngOnInit() {
  }

  onSplash(){
    debugger;
    this.isLogo = false;
  }
}
