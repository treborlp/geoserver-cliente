import {
  Component,
  OnInit,
  ViewChild,
  
} from '@angular/core';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {MatSidenav} from '@angular/material/sidenav';
import {ThemePalette} from '@angular/material/core';
import { MapService } from './_service/map.service';
import { Map } from './_model/map';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  url:string,
  capa: FeatureLayer;
  subtasks?: Task[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;


  constructor(private mapService: MapService) { }



  ngOnInit(): void {

    
  }

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  //Funciones de los Checkboks
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    url: "asda",
    capa: null,
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary', url: "https://services6.arcgis.com/c9GFTG11debu0wsH/arcgis/rest/services/Peligro_por_aluvion_en_la_subcuenca_Quillcay_parte_baja/FeatureServer/0", capa: null},
      {name: 'Accent', completed: false, color: 'accent', url: "asda", capa: null},
      {name: 'Warn', completed: false, color: 'warn', url: "asda", capa: null},
      {name: 'Placent', completed: false, color: 'warn', url: "asda", capa: null}
    ]
  };

  allComplete: boolean = false;


   updateAllComplete(){
     
     //const temp = await this.cargarCapaGeneral(t.url);
     this.task.subtasks.every(t=>{
       
       if(t.completed){ //Se seleccionar el checkbook
          // t.capa = new FeatureLayer({
          //   url: t.url
          // });
         const capa= new Map();
         capa.url= "https://services6.arcgis.com/c9GFTG11debu0wsH/arcgis/rest/services/Peligro_por_aluvion_en_la_subcuenca_Quillcay_parte_baja/FeatureServer/0";
         this.mapService.mapaCambio.next(capa);
         console.log("Capa enviada");
         //this.map.add(t.capa);
         //console.log(t.capa);
        }else{
          console.log("Remuevo la capa");
          //this.map.remove(t.capa)
        }
        
      })
      this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => {t.completed});

  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

}
