const canvas = document.getElementById('background')

function onResize() {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
}

window.addEventListener('resize', onResize)
onResize();

const gl = canvas.getContext('webgl2')

let vertices = []
let velocities = []
const PARTICLE_COUNT=10

function startX(){
    let x = Math.random()
    if (x > 0.5) {
        x = 0.9 + (x - 0.75) / 0.5 * 0.2
    } else {
        x = -0.9 + (x - 0.25) / 0.5 * 0.2
    }
    return x;
}
for (let i = 0; i < PARTICLE_COUNT; i++){
    let x = startX();
    let y = Math.random() * 2 - 1
    vertices.push(x, y, 0)

    let vy = Math.random()*0.25 + 0.25
    velocities.push(0, vy, 0)
}
// Create an empty buffer object to store the vertex buffer
var vertex_buffer = gl.createBuffer();

function updateVerticesBuffer(vertices){
    //Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
updateVerticesBuffer(vertices)

/*=========================Shaders========================*/

// vertex shader source code
var vertCode =
   'attribute vec3 coordinates;' +

   'void main(void) {' +
      ' gl_Position = vec4(coordinates, 1.0);' +
      'gl_PointSize = 5.0;'+
   '}';

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// fragment shader source code
var fragCode =
'void main(void) {' +
 ' gl_FragColor = vec4(0.4, 0.5, 0.3, 0.1);' +
'}';

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragmentt shader
gl.compileShader(fragShader);

// Create a shader program object to store
// the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader); 

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

/*======== Associating shaders to buffer objects ========*/

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(coord);

/*============= Drawing the primitive ===============*/
function updatePosition() {
    const FPS = 60
    for (let i = 0; i < PARTICLE_COUNT*3; i+=3){
        vertices[i+1] += velocities[i+1] / FPS
        if (vertices[i+1] > 1){
            vertices[i+1] = -1
            vertices[i] = startX()
        }
    }
    updateVerticesBuffer(vertices)
}
function render(){
    updatePosition()
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
    requestAnimationFrame(render)
}
requestAnimationFrame(render)