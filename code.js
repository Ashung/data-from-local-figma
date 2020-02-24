figma.showUI(__html__, { width: 240, height: 230 });
figma.on('selectionchange', update);
update();
function update() {
    let selection = figma.currentPage.selection;
    if (selection.length > 0) {
        if (selection.every(layer => layer.type === 'TEXT')) {
            figma.ui.postMessage({
                type: 'text',
                count: selection.length
            });
        }
        else if (selection.every(layer => layer.type !== 'TEXT' && layer.fills !== undefined)) {
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
    }
    else {
        figma.ui.postMessage({
            type: 'message',
            text: 'Select at least 1 text or shape layer.'
        });
    }
}
figma.ui.onmessage = msg => {
    let selection = figma.currentPage.selection;
    if (msg.type === 'text') {
        const selectedTextNodes = selection.map(item => item);
        const fontNames = getFontNamesFromLayers(selectedTextNodes);
        const loadFontTasks = fontNames.map(item => figma.loadFontAsync(item));
        Promise.all(loadFontTasks).then(() => {
            selectedTextNodes.forEach((node, index) => {
                node.characters = msg.data[index];
            });
        });
    }
    if (msg.type === 'image') {
        let images = msg.data;
        selection.forEach((node, index) => {
            const paint = {
                type: 'IMAGE',
                scaleMode: 'FILL',
                imageHash: figma.createImage(images[index]).hash
            };
            node.fills = [paint];
        });
    }
    if (msg.type === 'error') {
        figma.notify(msg.data);
    }
};
function getFontNamesFromLayers(layers) {
    let fontNames = [];
    let _temp = [];
    layers.forEach(function (layer) {
        let len = layer.characters.length;
        for (let i = 0; i < len; i++) {
            let fontName = layer.getRangeFontName(i, i + 1);
            let fontNameString = fontName.family + ' ' + fontName.style;
            if (_temp.indexOf(fontNameString) === -1) {
                fontNames.push(fontName);
                _temp.push(fontNameString);
            }
        }
    });
    return fontNames;
}
