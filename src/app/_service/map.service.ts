import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Map } from '../_model/map';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapaCambio = new Subject<Map>();
  constructor() { }
}
