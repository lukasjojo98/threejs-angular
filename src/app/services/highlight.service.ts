import { Injectable } from '@angular/core';
import { ThreeService } from './basic-three.service';
import * as THREE from 'three';
import { StoreElementsService } from './store-elements.service';

@Injectable({
  providedIn: 'root'
})
export class HighlightService{

  boxHelper: THREE.BoxHelper = new THREE.BoxHelper(new THREE.Object3D(), 0xffff00);
  arrowHelpers: THREE.ArrowHelper[] = [new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0, 0, 0), 2, 0x00ff00, .4, .1), new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0, 0, 0), 2, 0xff0000, .4, .1), new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0, 0, 0), 2, 0x0000ff, .4, .1)]; 

  constructor(private threeService: ThreeService, private storeElementsService: StoreElementsService) { }

  public highlightObject(id: any): void {
    const element: any = this.storeElementsService.findElementById(id);
    this.boxHelper.setFromObject(element);
    this.threeService.getScene().add(this.boxHelper);
    this.threeService.getScene().add(this.arrowHelpers[0], this.arrowHelpers[1], this.arrowHelpers[2]);
  }
  public getBoxHelper(): THREE.BoxHelper {
    return this.boxHelper;
  }
  public getArrowHelpers(): THREE.ArrowHelper[] {
    return this.arrowHelpers;
  }
 
}
