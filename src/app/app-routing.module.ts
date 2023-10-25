import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiddingComponent } from './bidding/bidding.component';
import { GolfComponent } from './golf/golf.component';
import { MysteryComponent } from './mystery/mystery.component';
import { RangeComponent } from './range/range.component';
import { ShoppingComponent } from './shopping/shopping.component';

const routes: Routes = [
  {
    path: '',
    component: BiddingComponent,
    title: 'bidding'
  },
  {
    path: 'bidding',
    component: BiddingComponent,
    title: 'bidding'
  },
  {
    path: 'range',
    component: RangeComponent,
    title: 'range'
  },
  {
    path: 'shopping',
    component: ShoppingComponent,
    title: 'shopping'
  },
  {
    path: 'golf',
    component: GolfComponent,
    title: 'golf'
  },  
  {
    path: 'mystery',
    component: MysteryComponent,
    title: 'mystery'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
