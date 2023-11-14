import { Component, HostListener } from '@angular/core';
import { FunctionalityService } from '../functionality.service';
import * as $ from "jquery";
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

const USERS_KEY = 'DBM_USERS';

@Component({
  selector: 'app-sidenav-selects',
  templateUrl: './sidenav-selects.component.html',
  styleUrls: ['./sidenav-selects.component.scss']
})
export class SidenavSelectsComponent {

  users: any[];
  filteredUsers!: any[];
  numInputs!: any[];
  defaultInputs!: any[];
  formValues!: any[];
  finalValues!: any[];
  index!: number;
  screen!: string;




  constructor(private functionalityService: FunctionalityService, private router: Router) {
    this.users = this.functionalityService.getGameData().userNames;
    this.defaultInputs = Array(23).fill(1).map((x, i) => { return { id: i + 1, val: '' } });
  }

  ngOnInit() {
    this.formValues = this.functionalityService.getObject(USERS_KEY);
    this.finalValues = (this.formValues.length > 0) ? this.formValues : this.defaultInputs;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        console.log(event)
      }
    })

    this.functionalityService.anIndexChangeEvent.subscribe((x: any) => {
      this.screen = x.screen;
      this.index = !!x.index ? x.index : 0;
      switch (x.screen) {
        case 'range':
          this.rangeMenu(this.index);
          break;
        case 'shopping':
          this.shoppingMenu(this.index);
          break;
        case 'golf':
          this.golfMenu(this.index);
          break;
      }
    })
  }

  ngAfterViewInit() {
    this.finalValues.forEach(x => {
      $(`#select${x.id} input`).val(x.val)
    })
  }

  filterCountry(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.users as any[]).length; i++) {
      let user = (this.users as any[])[i];
      if (user.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(user);
      }
    }

    this.filteredUsers = filtered;
  }

  onClick(id: any) {
    var y = this.finalValues.findIndex(x => x.id === id);
    // if(!!this.finalValues[x] && this.finalValues[x].selected){
    //   this.finalValues[x].selected = false
    // }else if(!!this.finalValues[x] && !this.finalValues[x].selected){
    //   this.finalValues[x].selected = true
    // }

    this.finalValues.forEach((x: any, i) => {
      this.clickByScreen(x, i, y, this.screen);
    })
    this.functionalityService.setObject(USERS_KEY, this.finalValues)
  }



  clickByScreen(x: any, index: number, currentindex: number, screen: any) {
    switch (screen) {
      case 'range':
        if ((currentindex >= 0 && currentindex <= 5) && (index >= 0 && index <= 5)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        else if ((currentindex > 5 && currentindex <= 11) && (index > 5 && index <= 11)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        else if ((currentindex > 11 && currentindex <= 17) && (index > 11 && index <= 17)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        else if (currentindex > 17 && index > 17) {
          if (currentindex === index) {
            x.isWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        break;
      case 'shopping':
        if ((currentindex >= 0 && currentindex <= 11) && (index >= 0 && index <= 11) && (x.isWinner === true)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.selected = false;
            x.isLost = true
          }
        }
        else if ((currentindex > 11 && currentindex <= 23) && (index > 11 && index <= 23) && (x.isWinner === true)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.selected = false;
            x.isLost = true
          }
        }
        break;
    }
  }

  biddingMenu(index: number) {
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  rangeMenu(index: number) {
    switch (index) {
      case 0:
        this.finalValues.forEach((x: any, i) => {
          if (i <= 23) {
            x.selected = false;
            x.isWinner = false;
            x.isLost = false;
          }
        })
        this.finalValues.forEach((x: any, i) => {
          if (i <= 5) {
            x.selected = true;
          }
        })
        break;
      case 1:
        this.finalValues.forEach((x: any, i) => {
          if (i > 5 && i <= 11 && !(!!x.selected || x.isWinner || x.isLost)) {
            x.selected = true;
          }
        })
        break;
      case 2:
        this.finalValues.forEach((x: any, i) => {
          if (i > 11 && i <= 17 && !(!!x.selected || x.isWinner || x.isLost)) {
            x.selected = true;
          }
        })
        break;
      case 3:
        this.finalValues.forEach((x: any, i) => {
          if (i > 17 && !(!!x.selected || x.isWinner || x.isLost)) {
            x.selected = true;
          }
        })
        break;
    }
  }

  golfMenu(index: number) {
  }

  shoppingMenu(index: number) {
    switch (index) {
      case 0:
        break;
      case 1:
        break;
    }
  }


  @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === ';') {
      var res = this.finalValues.map(x => {
        return {
          id: x.id,
          val: $(`#select${x.id} input`).val()
        }
      })
      res.forEach(x => console.log(`this id is ${x.id} and the value is ${x.val}`))
      this.functionalityService.setObject(USERS_KEY, res)
    }
    else if (event.key === '/') {
      const test: [{ id: string, val: string }] = this.functionalityService.getObject(USERS_KEY);
      test.forEach(x => console.log(`this id is ${x.id} and the value is ${x.val}`))
    }
  }
}
