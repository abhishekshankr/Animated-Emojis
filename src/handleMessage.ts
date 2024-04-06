// handleMessage.ts
async function handleMessage(msg: { type: string; imageUrl?: string; size: number, name: string }) {
    if (msg.type === 'add-emoji' && msg.imageUrl) {
        try {
            const response = await fetch(msg.imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const image = figma.createImage(uint8Array);
            
            const fill: Paint = {
                type: 'IMAGE',
                scaleMode: 'FILL',
                imageHash: image.hash
            };

const rect = figma.createRectangle();
rect.name = msg.name;
rect.resize(msg.size, msg.size);

// Check if there is a current selection
if (figma.currentPage.selection.length > 0) {
    // Get the first selected node
    const selectedNode = figma.currentPage.selection[0];

    // Check if the selected node is a frame or its parent is a frame
    let targetFrame = null;
    if (selectedNode.type === 'FRAME') {
        targetFrame = selectedNode;
    } else if (selectedNode.parent && selectedNode.parent.type === 'FRAME') {
        targetFrame = selectedNode.parent;
    }

    // If a target frame is found, append the rectangle to it
    if (targetFrame) {
        targetFrame.appendChild(rect);

        // Optionally, center the rectangle within the frame
        rect.x = (targetFrame.width / 2) - (rect.width / 2);
        rect.y = (targetFrame.height / 2) - (rect.height / 2);

        figma.currentPage.selection = [rect];
    } else {
        // If no frame is selected, append to the current page and center in the viewport
        appendAndCenterToViewport(rect);
    }
} else {
    // If nothing is selected, append to the current page and center in the viewport
    appendAndCenterToViewport(rect);
}

function appendAndCenterToViewport(rect : RectangleNode) {
    figma.currentPage.appendChild(rect);

    // Calculate the top-left corner's position so the rectangle is centered in the viewport
    const centerX = figma.viewport.center.x - (msg.size / 2);
    const centerY = figma.viewport.center.y - (msg.size / 2);

    // Set the rectangle's position
    rect.x = centerX;
    rect.y = centerY;

    figma.viewport.scrollAndZoomIntoView([rect]);
    figma.currentPage.selection = [rect];
}

rect.fills = [fill];

        } catch (error) {
            console.error('Failed to add emoji:', error);
            figma.closePlugin(`Failed to add emoji: ${error}`);
        }
    }
}

export { handleMessage };
