import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BiddingGameComponent } from './bidding-game/bidding-game.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavInputsComponent } from './sidenav-inputs/sidenav-inputs.component';
import { SidenavSelectsComponent } from './sidenav-selects/sidenav-selects.component';
import { BiddingComponent } from './bidding/bidding.component';
import { RangeComponent } from './range/range.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { GolfComponent } from './golf/golf.component';
import { InputNumberModule } from 'primeng/inputnumber';
import {SliderModule} from 'primeng/slider';
import { NgxSliderModule } from 'ngx-slider-v2';
import { ChipModule } from 'primeng/chip';
import {MatSliderModule} from '@angular/material/slider';
import { TabMenuModule } from 'primeng/tabmenu';
import { MysteryComponent } from './mystery/mystery.component';






@NgModule({
  declarations: [
    AppComponent,
    BiddingGameComponent,
    HeaderComponent,
    FooterComponent,
    SidenavInputsComponent,
    SidenavSelectsComponent,
    BiddingComponent,
    RangeComponent,
    ShoppingComponent,
    GolfComponent,
    MysteryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    FormsModule,
    InputNumberModule,
    SliderModule,
    NgxSliderModule,
    ChipModule,
    MatSliderModule,
    TabMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
