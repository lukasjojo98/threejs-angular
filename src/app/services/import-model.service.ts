import { Injectable } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ThreeService } from './basic-three.service';
import * as THREE from 'three';
import { StoreElementsService } from './store-elements.service';

@Injectable({
  providedIn: 'root'
})
export class ImportModelService {

  constructor(private threeService: ThreeService, private storeElementsService: StoreElementsService) { }

  public importModel(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    let loader: any = null;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      let content = e.target.result;

      if (file.name.endsWith(".obj")) {
        loader = new OBJLoader();
        const decoder = new TextDecoder();
        content = decoder.decode(content);
      } else if (file.name.endsWith(".glb")) {
        loader = new GLTFLoader();
      } else if (file.name.endsWith(".fbx")) {
        loader = new FBXLoader();
      } else {
        alert("File type not supported.");
        return;
      }
      const model = loader.parse(content).children[0];
      model.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      model.userData['id'] = this.storeElementsService.getIndex();
      this.storeElementsService.addElement(model);
      this.threeService.getScene().add(model);
      this.threeService.addDragableElements(model);
    };
    reader.readAsArrayBuffer(file);
  }
}
