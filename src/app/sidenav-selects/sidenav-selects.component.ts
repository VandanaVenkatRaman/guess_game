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
  isRow!: boolean;
  isLogo!: boolean;

  constructor(private functionalityService: FunctionalityService, private router: Router) {
    this.users = this.functionalityService.getGameData().userNames;
    this.defaultInputs = Array(23).fill(1).map((x, i) => { return { id: i + 1, val: '' } });
    this.isRow = false;
    this.isLogo = false;
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

      this.isRow = x.isRow;
      this.isLogo = x.isLogo

      debugger
      switch (x.screen) {
        case 'range':
          this.rangeMenu(this.index, this.isRow, this.isLogo);

          break;
        case 'shopping':
          this.shoppingMenu(this.index, x.isRow, this.isLogo);
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

    if (this.isLogo || this.isRow) return;

    var y = this.finalValues.findIndex(x => x.id === id);

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
            x.rangeWinner = true;
          } else {
            x.isWinner = false;
            x.rangeWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        else if ((currentindex > 5 && currentindex <= 11) && (index > 5 && index <= 11)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.rangeWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.rangeWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        else if ((currentindex > 11 && currentindex <= 17) && (index > 11 && index <= 17)) {
          if (currentindex === index) {
            x.isWinner = true;
            x.rangeWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.rangeWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        else if (currentindex > 17 && index > 17) {
          if (currentindex === index) {
            x.isWinner = true;
            x.rangeWinner = true;
            x.selected = false;
            x.isLost = false
          } else {
            x.isWinner = false;
            x.rangeWinner = false;
            x.selected = false;
            x.isLost = true
          }
        }
        break;
      case 'shopping':
        if ((currentindex >= 0 && currentindex <= 11) && (index >= 0 && index <= 11) && (x.rangeWinner === true)) {
          if (currentindex === index) {
            x.isWinner = true
            x.shoppingWinner = true
            x.selected = false
            x.isLost = false
          } else {
            x.selected = false
            x.isLost = true
            x.isWinner = false
            x.shoppingWinner = false
          }
        }
        else if ((currentindex > 11 && currentindex <= 23) && (index > 11 && index <= 23) && (x.rangeWinner === true)) {
          if (currentindex === index) {
            x.isWinner = true
            x.shoppingWinner = true
            x.selected = false
            x.isLost = false
          } else {
            x.selected = false
            x.isLost = true
            x.isWinner = false
            x.shoppingWinner = false
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

  rangeMenu(index: number, isRow: boolean, isLogo: boolean) {
    console.log('rangingggggggggg', { index, isRow, isLogo })
    if ((this.isLogo) && index === 0) {
      this.finalValues.forEach((x: any, i) => {

        x.selected = false;
        x.isWinner = false;
        x.isLost = false;
        x.playing = false;
        x.rangeWinner = false;
        x.shoppingWinner = false
      })
      return;
    }

    this.finalValues.forEach((x: any, i) => {
      x.playing = false;
    })

    switch (index) {
      case 0:
        this.finalValues.forEach((x: any, i) => {
          if (i <= 5) {
            x.selected = true;
            x.playing = true;
          }
        })
        break;
      case 1:
        this.finalValues.forEach((x: any, i) => {
          if (i > 5 && i <= 11) {
            x.selected = true;
            x.playing = true;
          }
        })
        break;
      case 2:
        this.finalValues.forEach((x: any, i) => {
          if (i > 11 && i <= 17) {
            x.selected = true;
            x.playing = true;
          }
        })
        break;
      case 3:
        this.finalValues.forEach((x: any, i) => {
          if (i > 17) {
            x.selected = true;
            x.playing = true;
          }
        })
        break;
    }
  }

  golfMenu(index: number) {
  }

  shoppingMenu(index: number, isRow: boolean, isLogo: boolean) {

    console.log('shoppingMenu', { index, isRow, isLogo })
    if ((this.isLogo) && index === 0) {
      this.finalValues.forEach((x: any, i) => {
        x.playing = false;
      })
      return;
    }

    let p = 0;
    switch (index) {
      case 0:
        for (let i = 0; i < this.finalValues.length; i++) {
          const x = this.finalValues[i];
          if (x.rangeWinner === true && p < 2) {
            x.playing = true;
            x.isLost = false;
            p = p + 1;
          }
          else {
            x.playing = false;
          }
        }

        break;
      case 1:

        for (let i = this.finalValues.length - 1; i >= 0; i--) {
          const x = this.finalValues[i];
          if (x.rangeWinner === true && p < 2) {
            x.playing = true;
            x.isLost = false;
            p = p + 1;
          }
          else {
            x.playing = false;
          }
        }
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
