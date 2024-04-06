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
            rect.fills = [fill];
            figma.currentPage.appendChild(rect);
            figma.viewport.scrollAndZoomIntoView([rect]);
        } catch (error) {
            console.error('Failed to add emoji:', error);
            figma.closePlugin(`Failed to add emoji: ${error}`);
        }
    }
}

export { handleMessage };
