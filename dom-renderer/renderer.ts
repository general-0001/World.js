// @worldjs/dom-renderer/renderer.ts

import { World, Entity } from '@worldjs/core';
import { DOMElement, Position, Text } from './components';

/**
 * A renderer class that draws the ECS state to the HTML DOM.
 */
export class DOMRenderer {
  private rootElement: HTMLElement;
  private elementMap = new Map<Entity, HTMLElement>();

  /**
   * @param world The World instance to operate on.
   * @param rootSelector The CSS selector for the root element to render into (e.g., '#app').
   */
  constructor(private world: World, rootSelector: string) {
    const root = document.querySelector(rootSelector);
    if (!root) {
      throw new Error(`Root element not found for selector: ${rootSelector}`);
    }
    this.rootElement = root as HTMLElement;
    this.rootElement.style.position = 'relative';

    // Subscribe to the entityDestroyed event to clean up DOM elements.
    this.world.events.on('entityDestroyed', (entity: Entity) => {
      this.removeElement(entity);
    });
  }

  /**
   * Synchronizes the World's state with the DOM. 
   * This method should be called every frame.
   */
  public update(): void {
    const entities = this.world.query([DOMElement]);

    for (const entity of entities) {
      let element = this.elementMap.get(entity);
      const domComponent = this.world.getComponent(entity, DOMElement)!;

      // Create the element if it doesn't exist yet.
      if (!element) {
        element = document.createElement(domComponent.tagName);
        element.className = domComponent.className;
        domComponent.element = element; // Store a reference to the element in the component.
        this.elementMap.set(entity, element);
        this.rootElement.appendChild(element);
      }

      // Update the position based on the Position component.
      if (this.world.hasComponent(entity, Position)) {
        const pos = this.world.getComponent(entity, Position)!;
        element.style.position = 'absolute';
        element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      
      // Update the text content based on the Text component.
      if (this.world.hasComponent(entity, Text)) {
        const text = this.world.getComponent(entity, Text)!;
        if (element.textContent !== text.value) {
          element.textContent = text.value;
        }
      }
    }
  }

  private removeElement(entity: Entity): void {
    const element = this.elementMap.get(entity);
    if (element) {
      element.remove();
      this.elementMap.delete(entity);
    }
  }
}
