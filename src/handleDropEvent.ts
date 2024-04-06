// handleDropEvent.ts
async function handleDropEvent(event: DropEvent) {
    const { items, dropMetadata } = event;

    if (items.length > 0 && items[0].type === "text/plain") {
        const imgSrc = items[0].data;
        const gifImgSrc = imgSrc.replace('512.webp', '512.gif');

        try {
            const response = await fetch(gifImgSrc);
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const image = figma.createImage(uint8Array);
            
            const fill: Paint = {
                type: 'IMAGE',
                scaleMode: 'FILL',
                imageHash: image.hash
            };

            const rect = figma.createRectangle();
            rect.name = dropMetadata.name;
            rect.resize(dropMetadata.size, dropMetadata.size);
            rect.fills = [fill];
            rect.x = event.absoluteX;
            rect.y = event.absoluteY;
            figma.currentPage.appendChild(rect);
        } catch (error) {
            console.error('Error processing the dropped item:', error);
        }
    }
}

export { handleDropEvent };
