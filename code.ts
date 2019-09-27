// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

let selection = figma.currentPage.selection;

const uiOption = { width: 240, height: 230 };

if (selection.every(layer => layer.type === 'TEXT')) {
    figma.showUI(__html__, uiOption);
    figma.ui.postMessage({
        type: 'text',
        layers: figma.currentPage.selection
    });
}
else if (selection.every(layer => layer.type !== 'TEXT' && (<GeometryMixin> layer).fills !== undefined)) {
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

// selection.forEach(layer => {
//     console.log(layer.type !== 'TEXT' && (<GeometryMixin> layer).fills !== undefined)
// })



// 


// This shows the HTML page in "ui.html".






// figma.ui.postMessage(figma.currentPage.selection);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage = msg => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   if (msg.type === 'create-rectangles') {
//     const nodes: SceneNode[] = [];
//     for (let i = 0; i < msg.count; i++) {
//       const rect = figma.createRectangle();
//       rect.x = i * 150;
//       rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//       figma.currentPage.appendChild(rect);
//       nodes.push(rect);
//     }
//     figma.currentPage.selection = nodes;
//     figma.viewport.scrollAndZoomIntoView(nodes);
//   }

//   // Make sure to close the plugin when you're done. Otherwise the plugin will
//   // keep running, which shows the cancel button at the bottom of the screen.
//   figma.closePlugin();
// };
