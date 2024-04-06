// main.ts
import { handleMessage } from './handleMessage';
import { handleDropEvent } from './handleDropEvent';

figma.showUI(__html__, { width: 700, height: 800 });

// Listen for messages sent from the plugin UI
figma.ui.onmessage = handleMessage;

// Handle drop events
figma.on('drop', (event: DropEvent) => {
  handleDropEvent(event).catch(error => console.error('Failed to handle drop event:', error));
  return false
});
