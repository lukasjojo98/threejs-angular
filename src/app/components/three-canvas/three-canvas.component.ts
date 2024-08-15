import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ThreeService } from '../../services/basic-three.service';
import { ControlService } from '../../services/control.service';
import { HighlightService } from '../../services/highlight.service';
import { StoreElementsService } from '../../services/store-elements.service';
import { SelectionService } from '../../services/selection.service';
import * as THREE from 'three';

@Component({
  selector: 'app-three-canvas',
  standalone: true,
  templateUrl: './three-canvas.component.html',
  styleUrl: './three-canvas.component.css'
})
export class ThreeCanvasComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  constructor(private threeService: ThreeService, private controlService: ControlService, private ngZone: NgZone, private highlightService: HighlightService, private storeElementsService: StoreElementsService, private selectionService: SelectionService) {}

  ngAfterViewInit() {
    this.canvasContainer.nativeElement.appendChild(this.threeService.getRendererElement());
    this.controlService.createControls(["Orbit", "Drag"], this.threeService.getCamera(), this.threeService.getRendererElement(), this.threeService.getElements());
  }
  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('keydown', this.onKeyDown.bind(this));
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  onKeyDown(event: KeyboardEvent): void {
    this.setArrowHelpersVisible();
    if (event.key === 'x') {
      this.controlService.setCoordinationType("x");
      this.highlightService.getArrowHelpers()[1].visible = false;
      this.highlightService.getArrowHelpers()[2].visible = false;
    }
    else if (event.key === 'y') {
      this.controlService.setCoordinationType("y");
      this.highlightService.getArrowHelpers()[0].visible = false;
      this.highlightService.getArrowHelpers()[2].visible = false;
    }
    else if (event.key === 'z') {
      this.controlService.setCoordinationType("z");
      this.highlightService.getArrowHelpers()[0].visible = false;
      this.highlightService.getArrowHelpers()[1].visible = false;
    }
    else if (event.key === 'a') {
      this.controlService.setCoordinationType("all");
    }
    else if (event.key == 'Delete') {
      this.storeElementsService.removeElement(this.selectionService.getSelectedObject());
      this.selectionService.setSelectedObject(new THREE.Object3D());
      this.highlightService.getBoxHelper().update();
    }
  }

  private setArrowHelpersVisible(): void {
    const arrowHelpers = this.highlightService.getArrowHelpers();
    for(let i = 0; i < arrowHelpers.length; i++){
      arrowHelpers[i].visible = true;
    }
  }
}
