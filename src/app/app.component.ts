import { Component } from '@angular/core';
import {Custom1ModuleModule} from "./custom1-module/custom1-module.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'custom-module';
  public getTitle(){
    return this.title;
  }
}
