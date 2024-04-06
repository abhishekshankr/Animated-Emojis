// Ensure you have the Figma typings available for better development experience
// This might involve installing @figma/plugin-typings

figma.showUI(__html__, { width: 700, height: 800 });

// Listen for messages sent from the plugin UI
figma.ui.onmessage = async (msg: { type: string; imageUrl?: string; size: number, name: string }) => {
    if (msg.type === 'add-emoji' && msg.imageUrl) {
        try {
            // Fetch the GIF image
            const response = await fetch(msg.imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Create a Figma image fill
            const image = figma.createImage(uint8Array);
            const fill: Paint = {
                type: 'IMAGE',
                scaleMode: 'FILL',
                imageHash: image.hash
            };
            
            // Create a rectangle to hold the GIF
            const rect = figma.createRectangle();
            rect.name = msg.name;
            rect.resize(msg.size, msg.size); // Set the size to 512x512
            rect.fills = [fill]; // Apply the image fill
            
            // Add the rectangle to the current page
            figma.currentPage.appendChild(rect);
            
            // Optionally, focus the view on the newly created rectangle
            figma.viewport.scrollAndZoomIntoView([rect]);
        } catch (error) {
            console.error('Failed to add emoji:', error);
            figma.closePlugin(`Failed to add emoji: ${error}`);
        }
    }
};
