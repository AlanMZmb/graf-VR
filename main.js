import * as THREE from 'three';

import { VRButton }
from 'three/addons/webxr/VRButton.js';

import { FBXLoader }
from 'three/addons/loaders/FBXLoader.js';

import { RGBELoader }
from 'three/addons/loaders/RGBELoader.js';

import { XRControllerModelFactory }
from 'three/addons/webxr/XRControllerModelFactory.js';


// ======================================
// ESCENA
// ======================================

const scene = new THREE.Scene();


// ======================================
// HDR
// ======================================

const rgbeLoader =
new RGBELoader();

rgbeLoader.load(

    './textures/sky.hdr',

    function(texture){

        texture.mapping =
        THREE.EquirectangularReflectionMapping;

        scene.background =
        texture;

        scene.environment =
        texture;

    }

);


// ======================================
// NIEBLA
// ======================================

scene.fog =
new THREE.Fog(

    0x050505,

    20,

    100

);


// ======================================
// PLAYER
// ======================================

const player =
new THREE.Group();

scene.add(player);


// ======================================
// CAMARA
// ======================================

const camera =
new THREE.PerspectiveCamera(

    75,

    window.innerWidth /
    window.innerHeight,

    0.1,

    1000

);

camera.position.set(
    0,
    1.7,
    0
);

player.position.set(
    0,
    0,
    10
);

player.add(camera);


// ======================================
// RENDER
// ======================================

const renderer =
new THREE.WebGLRenderer({

    antialias:true

});

renderer.setSize(

    window.innerWidth,

    window.innerHeight

);

renderer.xr.enabled = true;

renderer.shadowMap.enabled = false;

renderer.outputColorSpace =
THREE.SRGBColorSpace;

renderer.toneMapping =
THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
1;

renderer.setPixelRatio(

    Math.min(
        window.devicePixelRatio,
        2
    )

);

document.body.appendChild(
    renderer.domElement
);


// ======================================
// VR BUTTON
// ======================================

document.body.appendChild(

    VRButton.createButton(
        renderer
    )

);


// ======================================
// CONTROLADORES VR
// ======================================

const controller1 =
renderer.xr.getController(0);

scene.add(controller1);


const controller2 =
renderer.xr.getController(1);

scene.add(controller2);


const controllerModelFactory =
new XRControllerModelFactory();


// GRIP 1

const controllerGrip1 =
renderer.xr.getControllerGrip(0);

controllerGrip1.add(

    controllerModelFactory
    .createControllerModel(
        controllerGrip1
    )

);

scene.add(
    controllerGrip1
);


// GRIP 2

const controllerGrip2 =
renderer.xr.getControllerGrip(1);

controllerGrip2.add(

    controllerModelFactory
    .createControllerModel(
        controllerGrip2
    )

);

scene.add(
    controllerGrip2
);


// ======================================
// LUCES
// ======================================

const ambientLight =
new THREE.AmbientLight(

    0xffffff,

    0.7

);

scene.add(
    ambientLight
);


const moonLight =
new THREE.DirectionalLight(

    0xaabbff,

    1

);

moonLight.position.set(
    20,
    40,
    20
);

scene.add(
    moonLight
);


// ======================================
// SONIDO
// ======================================

const listener =
new THREE.AudioListener();

camera.add(listener);


const ambientSound =
new THREE.Audio(listener);


const audioLoader =
new THREE.AudioLoader();

audioLoader.load(

    './sounds/forest.mp3',

    function(buffer){

        ambientSound.setBuffer(
            buffer
        );

        ambientSound.setLoop(
            true
        );

        ambientSound.setVolume(
            0.5
        );

    }

);


// ======================================
// TEXTURA PISO
// ======================================

const textureLoader =
new THREE.TextureLoader();

const grassTexture =
textureLoader.load(

    './textures/grass.jpg'

);

grassTexture.wrapS =
THREE.RepeatWrapping;

grassTexture.wrapT =
THREE.RepeatWrapping;

grassTexture.repeat.set(
    8,
    8
);

grassTexture.anisotropy =
renderer.capabilities
.getMaxAnisotropy();


// ======================================
// PISO
// ======================================

const floorGeometry =
new THREE.PlaneGeometry(

    300,
    300,

    20,
    20

);

const floorMaterial =
new THREE.MeshStandardMaterial({

    map:grassTexture,

    roughness:1

});

const floor =
new THREE.Mesh(

    floorGeometry,

    floorMaterial

);

floor.rotation.x =
-Math.PI / 2;

scene.add(
    floor
);


// ======================================
// CARGADOR FBX
// ======================================

const loader =
new FBXLoader();


// ======================================
// MATERIAL SIMPLE
// ======================================

function applySimpleMaterial(
    object,
    color
){

    object.traverse((child)=>{

        if(child.isMesh){

            child.material =
            new THREE.MeshStandardMaterial({

                color:color

            });

        }

    });

}


// ======================================
// ARBOLES
// ======================================

for(let i = 0; i < 8; i++){

    loader.load(

        './models/fbx/tree.fbx',

        function(object){

            object.scale.set(
                0.03,
                0.03,
                0.03
            );

            object.position.set(

                Math.random() * 120 - 60,

                0,

                Math.random() * 120 - 60

            );

            object.rotation.y =
            Math.random() * Math.PI;

            applySimpleMaterial(

                object,

                0x224422

            );

            scene.add(
                object
            );

        }

    );

}


// ======================================
// ROCAS
// ======================================

for(let i = 0; i < 5; i++){

    loader.load(

        './models/fbx/rock.fbx',

        function(object){

            object.scale.set(
                1,
                1,
                1
            );

            object.position.set(

                Math.random() * 50 - 25,

                0,

                Math.random() * 50 - 25

            );

            applySimpleMaterial(

                object,

                0x666666

            );

            scene.add(
                object
            );

        }

    );

}


// ======================================
// FANTASMA
// ======================================

let ghost;

loader.load(

    './models/fbx/ghost.fbx',

    function(object){

        ghost = object;

        ghost.scale.set(
            0.05,
            0.05,
            0.05
        );

        ghost.position.set(
            0,
            2,
            -20
        );

        applySimpleMaterial(

            ghost,

            0xffffff

        );

        scene.add(
            ghost
        );

    }

);


// ======================================
// UI VR
// ======================================

const scoreCanvas =
document.createElement('canvas');

scoreCanvas.width = 512;
scoreCanvas.height = 256;

const scoreCtx =
scoreCanvas.getContext('2d');


const scoreTexture =
new THREE.CanvasTexture(
    scoreCanvas
);


const scoreMaterial =
new THREE.SpriteMaterial({

    map:scoreTexture,

    transparent:true

});


const scoreSprite =
new THREE.Sprite(
    scoreMaterial
);

scoreSprite.position.set(
    0,
    1.2,
    -2
);

scoreSprite.scale.set(
    1.5,
    0.7,
    1
);

camera.add(scoreSprite);


// ======================================
// UI UPDATE
// ======================================

function updateScoreUI(text){

    scoreCtx.clearRect(
        0,
        0,
        512,
        256
    );

    scoreCtx.fillStyle =
    'rgba(0,0,0,0.6)';

    scoreCtx.fillRect(
        0,
        0,
        512,
        256
    );

    scoreCtx.fillStyle =
    'white';

    scoreCtx.font =
    'bold 60px Arial';

    scoreCtx.textAlign =
    'center';

    scoreCtx.fillText(
        text,
        256,
        140
    );

    scoreTexture.needsUpdate =
    true;

}


// ======================================
// ORBES
// ======================================

const orbs = [];

let collected = 0;

updateScoreUI(
    'Orbes: 0 / 10'
);

for(let i = 0; i < 10; i++){

    const orbGeometry =
    new THREE.SphereGeometry(

        0.4,

        16,

        16

    );


    const orbMaterial =
    new THREE.MeshStandardMaterial({

        color:0x00ffff,

        emissive:0x00ffff,

        emissiveIntensity:4,

        roughness:0

    });


    const orb =
    new THREE.Mesh(

        orbGeometry,

        orbMaterial

    );


    orb.position.set(

        Math.random() * 80 - 40,

        1.2,

        Math.random() * 80 - 40

    );

    scene.add(
        orb
    );

    orbs.push(
        orb
    );

}


// ======================================
// MOVIMIENTO DESKTOP
// ======================================

const keys = {};

document.addEventListener(

    'keydown',

    (e)=>{

        keys[
            e.key.toLowerCase()
        ] = true;

    }

);

document.addEventListener(

    'keyup',

    (e)=>{

        keys[
            e.key.toLowerCase()
        ] = false;

    }

);


function moveDesktop(){

    const speed = 0.15;

    if(keys['w']){

        player.translateZ(
            -speed
        );

    }

    if(keys['s']){

        player.translateZ(
            speed
        );

    }

    if(keys['a']){

        player.translateX(
            -speed
        );

    }

    if(keys['d']){

        player.translateX(
            speed
        );

    }

}


// ======================================
// CLOCK
// ======================================

const clock =
new THREE.Clock();


// ======================================
// SNAP TURN
// ======================================

let canSnap = true;


// ======================================
// MOVIMIENTO VR
// ======================================

function moveVR(dt){

    const session =
    renderer.xr.getSession();

    if(!session) return;

    for(const source of session.inputSources){

        if(!source.gamepad)
            continue;

        const axes =
        source.gamepad.axes;


        // ======================================
        // LEFT STICK
        // ======================================

        if(source.handedness === 'left'){

            let x =
            axes[2];

            let y =
            axes[3];


            if(x === undefined || y === undefined){

                x = axes[0] || 0;
                y = axes[1] || 0;

            }


            const deadzone = 0.15;

            if(Math.abs(x) < deadzone)
                x = 0;

            if(Math.abs(y) < deadzone)
                y = 0;


            const xrCamera =
            renderer.xr.getCamera(camera);

            const realCamera =
            xrCamera.cameras[0];


            const forward =
            new THREE.Vector3();

            realCamera.getWorldDirection(
                forward
            );

            forward.y = 0;

            forward.normalize();


            const right =
            new THREE.Vector3();

            right.crossVectors(

                forward,

                new THREE.Vector3(
                    0,
                    1,
                    0
                )

            );

            right.normalize();


            const moveSpeed =
            4.0;


            player.position.addScaledVector(

                forward,

                -y *
                moveSpeed *
                dt

            );

            player.position.addScaledVector(

                right,

                x *
                moveSpeed *
                dt

            );

        }


        // ======================================
        // RIGHT STICK
        // ======================================

        if(source.handedness === 'right'){

            let turn =
            axes[2];

            if(turn === undefined){

                turn = axes[0] || 0;

            }


            if(
                canSnap &&
                Math.abs(turn) > 0.8
            ){

                const angle =
                THREE.MathUtils.degToRad(
                    45
                );

                if(turn > 0){

                    player.rotation.y -= angle;

                }else{

                    player.rotation.y += angle;

                }

                canSnap = false;

            }


            if(Math.abs(turn) < 0.2){

                canSnap = true;

            }

        }

    }

}


// ======================================
// DETECTAR ORBES
// ======================================

function checkOrbs(){

    orbs.forEach((orb)=>{

        if(!orb.visible)
            return;

        const distance =

        player.position
        .distanceTo(

            orb.position

        );

        if(distance < 2){

            orb.visible = false;

            collected++;

            updateScoreUI(

                `Orbes: ${collected} / 10`

            );

        }

    });

}


// ======================================
// GAME OVER
// ======================================

let gameOver = false;


// ======================================
// FANTASMA IA
// ======================================

function animateGhost(dt){

    if(!ghost || gameOver)
        return;


    const distance =

    ghost.position.distanceTo(
        player.position
    );


    ghost.lookAt(
        player.position
    );


    let speed = 0.5;

    speed +=
    collected * 0.15;


    const direction =
    new THREE.Vector3();

    direction.subVectors(

        player.position,

        ghost.position

    );

    direction.y = 0;

    direction.normalize();


    ghost.position.addScaledVector(

        direction,

        speed * dt

    );


    ghost.position.y =

        2 +

        Math.sin(
            Date.now() * 0.003
        ) * 0.5;


    // GAME OVER

    if(distance < 2){

        gameOver = true;

        updateScoreUI(
            'GAME OVER'
        );

        ambientSound.stop();

    }

}


// ======================================
// BOTON INICIAR
// ======================================

document
.getElementById(
    'btnIniciar'
)
.addEventListener(

    'click',

    ()=>{

        document
        .getElementById(
            'pantallaInicio'
        )
        .style.display = 'none';

        if(
            ambientSound &&
            !ambientSound.isPlaying
        ){

            ambientSound.play();

        }

    }

);


// ======================================
// ANIMACION
// ======================================

function animate(){

    const dt =
    Math.min(
        clock.getDelta(),
        0.05
    );

    moveDesktop();

    moveVR(dt);

    checkOrbs();

    animateGhost(dt);

    renderer.render(

        scene,

        camera

    );

}

renderer.setAnimationLoop(
    animate
);


// ======================================
// RESIZE
// ======================================

window.addEventListener(

    'resize',

    ()=>{

        camera.aspect =

        window.innerWidth /

        window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }

);