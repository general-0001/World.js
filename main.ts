// main.ts
import { World } from '@worldjs/core';
import { DOMRenderer } from '@worldjs/dom-renderer/renderer';
import { DOMElement, Text, Position } from '@worldjs/dom-renderer/components';

// --- Make sure you have an element with id="app" in your HTML ---
// <div id="app" style="width: 500px; height: 300px; border: 1px solid #ccc;"></div>

// --- Setup World and Renderer ---
const world = new World();
const renderer = new DOMRenderer(world, '#app');

// Register the renderer's update method as a system.
world.addSystem(() => renderer.update());


// --- Create Entities ---
const label = world.createEntity();
world.addComponent(label, new Position(10, 10));
world.addComponent(label, new DOMElement('h1', 'title-class'));
world.addComponent(label, new Text('Hello, World.js!'));

const box = world.createEntity();
world.addComponent(box, new Position(150, 80));
world.addComponent(box, new DOMElement('div', 'box-class'));
// You would define styles for .box-class in your CSS, e.g.,
// .box-class { width: 50px; height: 50px; background: cyan; }


// --- Main Loop ---
function gameLoop() {
  // ... Other game logic systems (like movement) could be added here ...
  world.run();
  requestAnimationFrame(gameLoop);
}

// Start the loop.
requestAnimationFrame(gameLoop);


// Demo: destroy the entity after 5 seconds.
setTimeout(() => {
  world.destroyEntity(label);
}, 5000);
