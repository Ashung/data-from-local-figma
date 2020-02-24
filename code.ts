figma.showUI(__html__, { width: 240, height: 230 });

figma.on('selectionchange', update);

update();

function update(): void {

    let selection = figma.currentPage.selection;

    if (selection.length > 0) {
        if (selection.every(layer => layer.type === 'TEXT')) {
            figma.ui.postMessage({
                type: 'text',
                count: selection.length
            });
        }
        else if (selection.every(layer => layer.type !== 'TEXT' && (<GeometryMixin> layer).fills !== undefined)) {
            figma.ui.postMessage({
                type: 'image',
                count: selection.length
            });
        }
        else {
            figma.ui.postMessage({
                type: 'message',
                text: 'Only support text and shape layer, but don\'t select both of them.'
            });
        }
    } else {
        figma.ui.postMessage({
            type: 'message',
            text: 'Select at least 1 text or shape layer.'
        });
    }
}

figma.ui.onmessage = msg => {
    let selection = figma.currentPage.selection;
    // Text
    if (msg.type === 'text') {
        const selectedTextNodes = selection.map(item => (<TextNode> item));
        const fontNames = getFontNamesFromLayers(selectedTextNodes);
        const loadFontTasks = fontNames.map(item => figma.loadFontAsync(item));
        Promise.all(loadFontTasks).then(() => {
            selectedTextNodes.forEach((node, index) => {
                node.characters = msg.data[index];
            });
        });
    }
    // Image
    if (msg.type === 'image') {
        let images = msg.data;
        selection.forEach((node, index) => {
            const paint: ImagePaint = {
                type: 'IMAGE',
                scaleMode: 'FILL',
                imageHash: figma.createImage(images[index]).hash
            };
            (<GeometryMixin> node).fills = [paint];
        });
    }
    // Error
    if (msg.type === 'error') {
        figma.notify(msg.data);
    }
};

function getFontNamesFromLayers(layers: TextNode []): FontName [] {
    let fontNames = [];
    let _temp = [];
    layers.forEach(function(layer) {
        let len = layer.characters.length;
        for (let i = 0; i < len; i++) {
            let fontName = layer.getRangeFontName(i, i+1);
            let fontNameString = (<FontName> fontName).family + ' ' + (<FontName> fontName).style;
            if (_temp.indexOf(fontNameString) === -1) {
                fontNames.push(fontName);
                _temp.push(fontNameString);
            }
        }
    });
    return fontNames;
}
