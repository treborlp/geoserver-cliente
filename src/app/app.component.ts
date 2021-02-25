import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  NgZone
} from '@angular/core';

import WebMap from '@arcgis/core/WebMap';
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Expand from '@arcgis/core/widgets/Expand';
import esriConfig from '@arcgis/core/config.js';
import { environment } from 'src/environments/environment';

import {MatSidenav} from '@angular/material/sidenav';
import {ThemePalette} from '@angular/material/core';

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

export class AppComponent implements OnInit, OnDestroy {

  
  private view: any = null;
  public map: Map;


  @ViewChild('sidenav') sidenav: MatSidenav;
  
  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  title = 'ng-cli';

  constructor(private zone: NgZone) { }

  initializeMap(): Promise<any> {
    
    const container = this.mapViewEl.nativeElement;

    this.map = new Map({
      basemap: "satellite",
    });

    const webmap = new WebMap({
      portalItem: {
        id: 'aa1d3f80270146208328cf66d022e09c',
      },
    });

    const view = new MapView({
      container,
     // map: webmap,
      map:this.map, 
      center: [-75.992506, -10.258561],
      zoom: 8
    });

    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    const bkExpand = new Expand({
      view,
      content: bookmarks,
      expanded: true,
    });

    // Add the widget to the top-right corner of the view
    view.ui.add(bkExpand, 'top-right');

    // Add layers geoportal
    const url = "https://services6.arcgis.com/c9GFTG11debu0wsH/arcgis/rest/services/Inventario_de_Glaciares_a%C3%B1o_2018/FeatureServer/0";
    this.map.add(this.cargarCapaGeneral(url))

    // bonus - how many bookmarks in the webmap?
    webmap.when(() => {
      if (webmap.bookmarks && webmap.bookmarks.length) {
        console.log('Bookmarks: ', webmap.bookmarks.length);
      } else {
        console.log('No bookmarks in this webmap.');
      }
    });

    this.view = view;

    return this.view.when();
  }

  ngOnInit(): any {

    // Required: Set this property to insure assets resolve correctly.
    // IMPORTANT: the directory path may be different between your production app and your dev app
    esriConfig.assetsPath = '/assets';
    esriConfig.apiKey= environment.apiKey;

    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then(() => {
        // The map has been initialized
        this.zone.run(() => {
          console.log('mapView ready: ');
        });
      });

    });
  }


  cargarCapaGeneral = async(url) => {
    let capa = new FeatureLayer({
        url
    });

    if (!capa)
        throw new Error("La capa no pude obtenerse");
    else {
        return capa;
    }
}

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
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
      {name: 'Placent', completed: true, color: 'warn', url: "asda", capa: null}
    ]
  };

  allComplete: boolean = false;


   updateAllComplete = async()=>{
     
     //const temp = await this.cargarCapaGeneral(t.url);
     this.task.subtasks.every(t=>{
       
       if(t.completed){
          t.capa = new FeatureLayer({
            url: t.url
          });
         console.log(t.capa);
         this.map.add(t.capa);
         //console.log(t.capa);
         console.log("Cargo la capa");
        }else{
          console.log("Remuevo la capa");
           this.map.remove(t.capa)
        }
        
      })
      this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => {t.completed});

    return this.allComplete;
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
