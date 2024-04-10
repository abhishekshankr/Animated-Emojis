async function handleDropEvent(event: DropEvent) {
    const { items, dropMetadata } = event;

    if (items.length > 0 && items[0].type === "text/plain") {
        const webpImageUrl = items[0].data;
        const gifImageUrl = webpImageUrl.replace('512.webp', '512.gif');

        try {
            // Fetch and process the image data
            const uint8Array = await fetchImageData(gifImageUrl);
            // Create and configure the shape based on the editor type
            createShapeForEditor(uint8Array, dropMetadata, event.absoluteX, event.absoluteY);
        } catch (error) {
            console.error('Error processing the dropped item:', error);
        }
    }
}

async function fetchImageData(imageUrl: string): Promise<Uint8Array> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
}

function createShapeForEditor(imageData: Uint8Array, metadata: any, posX: number, posY: number) {
    const image = figma.createImage(imageData);
    const fill: Paint = { type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash };

    if (figma.editorType === 'figma') {
        createAndAppendRectangle(fill, metadata, posX, posY);
    } else if (figma.editorType === 'figjam') {
        createAndAppendGif(image.hash, metadata, posX, posY);
    }
}

function createAndAppendRectangle(fill: Paint, metadata: any, posX: number, posY: number) {
    const rect = figma.createRectangle();
    configureShape(rect, fill, metadata, posX, posY);
}

function createAndAppendGif(imageHash: string, metadata: any, posX: number, posY: number) {
    const gif = figma.createGif(imageHash); // Assuming createGif exists and works similarly to createRectangle
    configureShape(gif, null, metadata, posX, posY); // Note: Fills don't apply to gifs, passing null for fill
}

function configureShape(shape: RectangleNode | MediaNode, fill: Paint | null, metadata: any, posX: number, posY: number) {
    if (fill) {
        // Assuming the shape can have fills, e.g., Rectangle. This wouldn't apply to Gif in FigJam as per assumed API.
        (shape as RectangleNode).fills = [fill];
    }
    shape.name = metadata.name;
    shape.resize(metadata.size, metadata.size);
    shape.x = posX;
    shape.y = posY;
    figma.currentPage.appendChild(shape);
}

export { handleDropEvent };
