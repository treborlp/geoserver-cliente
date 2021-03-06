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
import { MapService } from 'src/app/_service/map.service';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements OnInit, OnDestroy {

  private view: any = null;
  private map: Map;
  private webMap: WebMap;

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  constructor(
    private zone: NgZone,
    private mapService: MapService) { }

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
      zoom: 8,
    });

    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    const bkExpand = new Expand({
      view, 
      content: bookmarks,
      expanded: false,
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
   // esriConfig.apiKey= environment.apiKey;

    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then(() => {
        // The map has been initialized
        this.zone.run(() => {
          console.log('mapView ready: ');
        });
      });

    });

    this.mapService.mapaCambio.subscribe((capa)=>{
      const capaRecibida = new FeatureLayer({
        url: capa.url
      })

      this.map.add(capaRecibida);
      this.view.zoom = 12;
      this.view.center = [-77.524570, -9.530104];

     
      console.log("Capa recibida");

    })

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

}
