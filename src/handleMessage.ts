async function handleMessage(msg: { type: string; imageUrl?: string; size: number; name: string }) {
    if (msg.type !== 'add-emoji' || !msg.imageUrl) {
        return; // Early return if the message is not to add an emoji or if imageUrl is missing
    }

    try {
        const uint8Array = await fetchImageAsUint8Array(msg.imageUrl);
        createAndPositionShape(uint8Array, msg);
    } catch (error) {
        console.error('Failed to add emoji:', error);
        figma.closePlugin(`Failed to add emoji: ${error}`);
    }
}

async function fetchImageAsUint8Array(imageUrl: string): Promise<Uint8Array> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

function createAndPositionShape(imageData: Uint8Array, msg: { size: number; name: string }) {
    let shape: SceneNode;

    if (figma.editorType === 'figma') {
        shape = createRectangle(imageData, msg);
    } else { // Assuming the editorType could be 'figjam' or others
        shape = createGif(imageData, msg);
    }

    positionShapeInViewport(shape, msg.size);
}

function createRectangle(imageData: Uint8Array, msg: { size: number; name: string }): RectangleNode {
    const image = figma.createImage(imageData);
    const rect = figma.createRectangle();
    rect.name = msg.name;
    rect.resize(msg.size, msg.size);
    rect.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
    return rect;
}

function createGif(imageData: Uint8Array, msg: { size: number; name: string }): MediaNode {
    
    const image = figma.createImage(imageData);
    const gif = figma.createGif(image.hash);
    gif.name = msg.name;
    gif.resize(msg.size, msg.size);
    return gif;
}

function positionShapeInViewport(shape: SceneNode, size: number) {
    let targetX;
    let targetY;

    if (figma.currentPage.selection.length > 0 && figma.currentPage.selection[0].type === 'FRAME') {
        const selectedFrame = figma.currentPage.selection[0] as FrameNode;
        targetX = selectedFrame.width / 2 - (size / 2);
        targetY = selectedFrame.height / 2 - (size / 2);
        shape.x = targetX;
        shape.y = targetY;
        selectedFrame.appendChild(shape);
    } else {
        const centerX = figma.viewport.center.x - (size / 2);
        const centerY = figma.viewport.center.y - (size / 2);
        shape.x = centerX;
        shape.y = centerY;
        figma.currentPage.appendChild(shape);
    }
    figma.currentPage.selection = [shape];
    figma.viewport.scrollAndZoomIntoView([shape]);
}

export { handleMessage };
