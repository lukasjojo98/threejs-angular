import { Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { SelectionService } from './selection.service';
import { HighlightService } from './highlight.service';
import * as THREE from 'three';
import { ThreeService } from './basic-three.service';

@Injectable({
  providedIn: 'root'
})

export class ControlService {
  private dragControls!: DragControls;
  private orbitControls!: OrbitControls;
  private coordinationType !: string;

  constructor(private selectionService: SelectionService, private highlightService: HighlightService) { }

  createControls(type: string[], camera: any, renderer: HTMLElement, elements?: any): any {
    for(let i = 0; i < type.length; i++){
      if(type[i] == "Drag"){
        this.dragControls = new DragControls(elements, camera, renderer);
        this.dragControls.addEventListener("hoveron", (event: any) => {
          event.object.material.wireframe = true;
        });
    
        this.dragControls.addEventListener("hoveroff", (event: any) => {
          event.object.material.wireframe = false;
        });
    
        this.dragControls.addEventListener("drag", (event: any) => {
          const selectedObject = this.selectionService.getSelectedObject();
          const initialPosition = event.object.userData.initialPosition;
          selectedObject.position.set(event.object.position.x, event.object.position.y, event.object.position.z);
          if(this.coordinationType == "x"){
            event.object.position.z = initialPosition.z;
            event.object.position.y = initialPosition.y;
          }
          else if(this.coordinationType == "y"){
            event.object.position.x = initialPosition.x;
            event.object.position.z = initialPosition.z;
          }
          else if(this.coordinationType == "z"){
            event.object.position.y = initialPosition.y;
            event.object.position.x = initialPosition.x;
          }
          this.highlightService.getBoxHelper().update();
          const helpers = this.highlightService.getArrowHelpers();
          for(let i = 0; i < helpers.length; i++) {
            helpers[i].position.set(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
          }
        });
    
        this.dragControls.addEventListener("dragstart", (event: any) => {
          this.orbitControls.enabled = false;
          event.object.material.wireframe = false;
          this.selectionService.setSelectedObject(event.object);
          event.object.userData.initialPosition = { 
            x: event.object.position.x,
            y: event.object.position.y,
            z: event.object.position.z 
          };
          const id = event.object.userData['id'];
          const objectElements = document.querySelectorAll('.object-item');
          for(let i = 0; i < objectElements.length; i++){
            objectElements[i].classList.remove('selected');
          }
          if(id != undefined){
            document.getElementById(id)?.classList.add('selected');
          }
          this.highlightService.highlightObject(id);
        });
    
        this.dragControls.addEventListener("dragend", (event: any) => {
          this.orbitControls.enabled = true;
        });
      }
      else if(type[i] == "Orbit"){
        this.orbitControls = new OrbitControls(camera, renderer);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 1.0;
        this.orbitControls.enableZoom = true;
      }
    }
  }
  public setCoordinationType(coordinate: string): void {
    this.coordinationType = coordinate;
  }
}