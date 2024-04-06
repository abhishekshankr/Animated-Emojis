figma.showUI(__html__, { width: 400, height: 400 });

// Listen for messages sent from the plugin UI
figma.ui.onmessage = async msg => {
    if (msg.type === 'add-emoji') {
        // Fetch the GIF image
        const response = await fetch('https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif');
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
        rect.resize(512, 512); // Set the size to 512x512
        rect.fills = [fill]; // Apply the image fill
        
        // Add the rectangle to the current page
        figma.currentPage.appendChild(rect);
        
        // Optionally, focus the view on the newly created rectangle
        figma.viewport.scrollAndZoomIntoView([rect]);
    }
};
