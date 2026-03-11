const fs = require('fs');
try {
    const data = fs.readFileSync('public/models/car_lowpoly/scene.gltf', 'utf8');
    const gltf = JSON.parse(data);
    function printNode(idx, indent) {
        const n = gltf.nodes[idx];
        console.log(indent + n.name);
        if (n.children) n.children.forEach(c => printNode(c, indent + '  '));
    }
    gltf.scenes[0].nodes.forEach(n => printNode(n, ''));
} catch (e) {
    console.error(e);
}
