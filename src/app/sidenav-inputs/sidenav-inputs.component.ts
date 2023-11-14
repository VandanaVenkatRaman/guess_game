import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FunctionalityService } from '../functionality.service';
import * as $ from "jquery";

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

const USERS_KEY = 'DBM_USERS';

@Component({
  selector: 'app-sidenav-inputs',
  templateUrl: './sidenav-inputs.component.html',
  styleUrls: ['./sidenav-inputs.component.scss']
})
export class SidenavInputsComponent {

  users: any[];
  filteredUsers!: any[];
  numInputs!: any[];
  defaultInputs!: any[];
  formValues!: any[];
  finalValues!: any[];



  constructor(private functionalityService: FunctionalityService) {
    this.users = this.functionalityService.getGameData().userNames;
    this.defaultInputs = Array(23).fill(1).map((x, i) => { return { id: i + 1, val: '', selected: false } });
  }

  ngOnInit() {
    debugger;
    this.formValues = this.functionalityService.getObject(USERS_KEY);
    this.finalValues = (!!this.formValues) ? this.formValues : this.defaultInputs;
    console.log(this.finalValues)
  }

  ngAfterViewInit() {
    this.finalValues.forEach(x => {
      $(`#input${x.id} input`).val(x.val)
    })
  }

  onChange(id: any) {
    console.log(id);
    var x = this.finalValues.findIndex(x => x.id === id);
    this.finalValues[x].val = $(`#input${id} input`).val();
    console.table(this.finalValues);
    this.functionalityService.setObject(USERS_KEY, this.finalValues)
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


  @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === ';') {
      //   var res = this.finalValues.map(x => {
      //   return {
      //     id: x.id,
      //     val: $(`#input${x.id} input`).val()
      //   }
      // });
      // res.forEach(x => console.log(`this id is ${x.id} and the value is ${x.val}`))
      // this.functionalityService.setObject(USERS_KEY, res)
      //this.functionalityService.aPopUpEvent.emit({ screen: '', action: 'wrong' })
    }
    else if (event.key === '/') {
      const test: [{ id: string, val: string }] = this.functionalityService.getObject(USERS_KEY);
      test.forEach(x => console.log(`this id is ${x.id} and the value is ${x.val}`))
    }
  }

}
