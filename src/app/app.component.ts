import { Component } from '@angular/core';
import { FunctionalityService } from './functionality.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PartyTime';
  test = [{}];
  isLogo = true;

  constructor(private functionalityService: FunctionalityService,private router: Router){

  }

  ngOnInit() {
  }

  onSplash(){
    this.isLogo = false;
    this.router.navigate(['/bidding']);
}
}
