import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { SelectionService } from '../../services/selection.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { ThreeService } from '../../services/basic-three.service';
import * as THREE from 'three';
import { HighlightService } from '../../services/highlight.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})

export class MenuCardComponent {

  objectProperties!: Map<string,string>;

  constructor(private selectionService: SelectionService, private threeService: ThreeService, private highlightService: HighlightService) {}

  getProperties(): any {
    return Array.from(this.selectionService.getProperties().keys()); 
  }
  getValuesToProperty(index: any): any {
    return Array.from(this.selectionService.getProperties().values())[index];
  }
  getObjects(): THREE.Object3D[] {
    return this.threeService.getElements();
  }
  changeBackgroundColor(event: any): any {
    this.threeService.getScene().background = new THREE.Color(event.target.value);
  }
  getSelectedObjectProperty(input: string): any {
    const element = this.selectionService.getSelectedObject();
    if(element){
      if(input == "name"){
        return element.name;
      }
      else if(input == "type"){
        return element.type;
      }
    }      
    
  }
  handleClick(event: any): void {
    const id = event.srcElement.id;
    const objectElements = document.querySelectorAll('.object-item');
    for(let i = 0; i < objectElements.length; i++){
      objectElements[i].classList.remove('selected');
    }
    event.srcElement.classList.add('selected');
    this.highlightService.highlightObject(id);
  }
  transformObject(event: any): any {
    const object = this.selectionService.getSelectedObject();
    const element = event.srcElement;
    if(element.id[0] == "0"){
      if(element.id[1] == "0"){
        object.position.setX(element.value);
      }
      if(element.id[1] == "1"){
        object.position.setY(element.value);
      }
      if(element.id[1] == "2"){
        object.position.setZ(element.value);
      }
    }
    if(element.id[0] == "1"){
      if(element.id[1] == "0"){
        object.scale.setX(element.value);
      }
      if(element.id[1] == "1"){
        object.scale.setY(element.value);
      }
      if(element.id[1] == "2"){
        object.scale.setZ(element.value);
      }
    }
    if(element.id[0] == "2"){
      if(element.id[1] == "0"){
        object.rotateX(element.value);
      }
      if(element.id[1] == "1"){
        object.rotateY(element.value);
      }
      if(element.id[1] == "2"){
        object.rotateZ(element.value);
      }
    }
    this.highlightService.getBoxHelper().update();
    const helpers = this.highlightService.getArrowHelpers();
    for(let i = 0; i < helpers.length; i++) {
      helpers[i].position.set(object.position.x, object.position.y, object.position.z);
    }
  }
}
