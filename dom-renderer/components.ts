// @worldjs/dom-renderer/components.ts

/**
 * Indicates that an entity with this component should be rendered as a DOM element.
 */
export class DOMElement {
  /** A reference to the created HTMLElement. */
  public element: HTMLElement | null = null; 

  /**
   * @param tagName The tag name of the HTML element to create (e.g., 'div', 'span').
   * @param className The CSS class name(s) for the element.
   */
  constructor(public tagName: string, public className: string = '') {}
}

/**
 * A component that defines the text content of a DOM element.
 */
export class Text {
  constructor(public value: string) {}
}

/**
 * A component that defines the position of a DOM element.
 * (This could be a shared component in a separate package).
 */
export class Position {
  constructor(public x: number, public y: number) {}
}
