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

  users : any[];
  filteredUsers!: any[];
  numInputs!: any[];
  defaultInputs!:any[];
  formValues!:any[];
  finalValues!:any[];

  

  constructor(private functionalityService: FunctionalityService, private router: Router){
    this.users = this.functionalityService.getGameData().userNames;
    this.defaultInputs = Array(23).fill(1).map((x, i) => {return {id: i+1, val: ''}});
  }

  ngOnInit(){
    this.formValues = this.functionalityService.getObject(USERS_KEY);
    this.finalValues = (this.formValues.length > 0)? this.formValues: this.defaultInputs;
    this.router.events.subscribe((event:any) => {
      if (event instanceof NavigationEnd) {
        console.log(event)
      }})
  }

  ngAfterViewInit(){
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
  var x = this.finalValues.findIndex(x => x.id === id);
  if(!!this.finalValues[x] && this.finalValues[x].selected){
    this.finalValues[x].selected = false
  }else if(!!this.finalValues[x] && !this.finalValues[x].selected){
    this.finalValues[x].selected = true
  }

  this.functionalityService.setObject(USERS_KEY,this.finalValues)
}


@HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  console.log(event.key);
  if(event.key === ';'){
    var res = this.finalValues.map(x => {
      return {
        id: x.id,
        val: $(`#select${x.id} input`).val()
      }
    })
    res.forEach(x => console.log(`this id is ${x.id} and the value is ${x.val}`))
    this.functionalityService.setObject(USERS_KEY, res)
  }
  else if(event.key === '/'){
  const test:[{id:string, val: string}]= this.functionalityService.getObject(USERS_KEY);
  test.forEach(x => console.log(`this id is ${x.id} and the value is ${x.val}`))
  }
}

}
