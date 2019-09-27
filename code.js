let selection = figma.currentPage.selection;
const uiOption = { width: 240, height: 230 };
if (selection.every(layer => layer.type === 'TEXT')) {
    figma.showUI(__html__, uiOption);
    figma.ui.postMessage({
        type: 'text',
        layers: figma.currentPage.selection
    });
}
else if (selection.every(layer => layer.type !== 'TEXT' && layer.fills !== undefined)) {
    figma.showUI(__html__, uiOption);
    figma.ui.postMessage({
        type: 'image',
        layers: figma.currentPage.selection
    });
}
else {
    figma.notify('Only support text and shape layer, but don\'t select both of them.');
    figma.closePlugin();
}
