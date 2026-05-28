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

    15,

    80

);


// ======================================
// PLAYER RIG
// ======================================

const playerRig =
new THREE.Group();

scene.add(playerRig);


// ======================================
// PLAYER
// ======================================

const player =
new THREE.Group();

playerRig.add(player);


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

playerRig.position.set(
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
0.9;

renderer.setPixelRatio(

    Math.min(
        window.devicePixelRatio,
        2
    )

);

document.body.appendChild(
    renderer.domElement);


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

    0.5

);

scene.add(
    ambientLight
);


const moonLight =
new THREE.DirectionalLight(

    0xaabbff,

    0.8

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
// TEXTURAS
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
    20,
    20
);


// ======================================
// PISO
// ======================================

const floorGeometry =
new THREE.PlaneGeometry(

    400,
    400,

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
// COLLIDERS
// ======================================

const colliders = [];


// ======================================
// CHECK COLLISION
// ======================================

function checkCollision(nextPosition){

    for(const collider of colliders){

        if(collider.type === 'box'){

            const playerBox =
            new THREE.Box3(

                new THREE.Vector3(

                    nextPosition.x - 0.5,
                    0,
                    nextPosition.z - 0.5

                ),

                new THREE.Vector3(

                    nextPosition.x + 0.5,
                    2,
                    nextPosition.z + 0.5

                )

            );


            if(
                playerBox.intersectsBox(
                    collider.box
                )
            ){

                return true;

            }

        }

        else{

            const distance =

            nextPosition.distanceTo(
                collider.position
            );

            if(distance < collider.radius){

                return true;

            }

        }

    }

    return false;

}


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
// MUCHOS ARBOLES
// ======================================

for(let i = 0; i < 60; i++){

    loader.load(

        './models/fbx/tree.fbx',

        function(object){

            object.scale.set(
                0.03,
                0.03,
                0.03
            );

            const x =
            Math.random() * 220 - 110;

            const z =
            Math.random() * 220 - 110;

            object.position.set(
                x,
                0,
                z
            );

            object.rotation.y =
            Math.random() * Math.PI;

            applySimpleMaterial(
                object,
                0x224422
            );

            scene.add(object);


            colliders.push({

                position:
                new THREE.Vector3(
                    x,
                    0,
                    z
                ),

                radius:1.5

            });

        }

    );

}


// ======================================
// ROCAS
// ======================================

for(let i = 0; i < 8; i++){

    loader.load(

        './models/fbx/rock.fbx',

        function(object){

            object.scale.set(
                1,
                1,
                1
            );

            const x =
            Math.random() * 120 - 60;

            const z =
            Math.random() * 120 - 60;

            object.position.set(
                x,
                0,
                z
            );

            applySimpleMaterial(
                object,
                0x666666
            );

            scene.add(object);


            const box =
            new THREE.Box3()
            .setFromObject(object);


            colliders.push({

                box:box,

                type:'box'

            });

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
            0.035,
            0.035,
            0.035
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


// ======================================
// UI POSITION
// ======================================

scoreSprite.position.set(

    0,

    0.25,

    -1.2

);


// ======================================
// UI SIZE
// ======================================

scoreSprite.scale.set(

    0.7,

    0.3,

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

        Math.random() * 140 - 70,

        1.2,

        Math.random() * 140 - 70

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

    if(gameOver)
        return;

    const speed = 0.15;

    const nextPosition =
    playerRig.position.clone();

    const forward =
    new THREE.Vector3(
        0,
        0,
        -1
    );

    forward.applyQuaternion(
        playerRig.quaternion
    );

    forward.y = 0;

    forward.normalize();


    const right =
    new THREE.Vector3(
        1,
        0,
        0
    );

    right.applyQuaternion(
        playerRig.quaternion
    );

    right.y = 0;

    right.normalize();


    if(keys['w']){

        nextPosition.addScaledVector(
            forward,
            speed
        );

    }

    if(keys['s']){

        nextPosition.addScaledVector(
            forward,
            -speed
        );

    }

    if(keys['a']){

        nextPosition.addScaledVector(
            right,
            -speed
        );

    }

    if(keys['d']){

        nextPosition.addScaledVector(
            right,
            speed
        );

    }


    if(
        !checkCollision(
            nextPosition
        )
    ){

        playerRig.position.copy(
            nextPosition
        );

    }

}


// ======================================
// CLOCK
// ======================================

const clock =
new THREE.Clock();


// ======================================
// GAME OVER
// ======================================

let gameOver = false;


// ======================================
// SPRINT
// ======================================

let sprintMultiplier = 1;


// ======================================
// END GAME
// ======================================

function endGame(message){

    gameOver = true;

    updateScoreUI(
        message
    );

    ambientSound.stop();

}


// ======================================
// MOVIMIENTO VR
// ======================================

function moveVR(dt){

    if(gameOver)
        return;

    const session =
    renderer.xr.getSession();

    if(!session) return;

    for(const source of session.inputSources){

        if(!source.gamepad)
            continue;

        const axes =
        source.gamepad.axes;


        // LEFT STICK

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


            // SPRINT

            const trigger =
            source.gamepad.buttons[0];


            if(
                trigger &&
                trigger.value > 0.5
            ){

                sprintMultiplier = 2;

            }else{

                sprintMultiplier = 1;

            }


            const forward =
            new THREE.Vector3(
                0,
                0,
                -1
            );

            forward.applyQuaternion(
                playerRig.quaternion
            );

            forward.y = 0;

            forward.normalize();


            const right =
            new THREE.Vector3(
                1,
                0,
                0
            );

            right.applyQuaternion(
                playerRig.quaternion
            );

            right.y = 0;

            right.normalize();


            const moveSpeed =
            4.0 * sprintMultiplier;


            const nextPosition =
            playerRig.position.clone();


            nextPosition.addScaledVector(

                forward,

                -y *
                moveSpeed *
                dt

            );

            nextPosition.addScaledVector(

                right,

                x *
                moveSpeed *
                dt

            );


            if(
                !checkCollision(
                    nextPosition
                )
            ){

                playerRig.position.copy(
                    nextPosition
                );

            }

        }


        // RIGHT STICK

        if(source.handedness === 'right'){

            let turn =
            axes[2];

            if(turn === undefined){

                turn = axes[0] || 0;

            }


            if(Math.abs(turn) < 0.15)
                turn = 0;


            const rotationSpeed =
            2.5;


            playerRig.rotation.y -=

                turn *
                rotationSpeed *
                dt;

        }

    }

}


// ======================================
// ORBES
// ======================================

function checkOrbs(){

    if(gameOver)
        return;

    orbs.forEach((orb)=>{

        if(!orb.visible)
            return;

        const distance =

        playerRig.position
        .distanceTo(

            orb.position

        );

        if(distance < 2){

            orb.visible = false;

            collected++;

            updateScoreUI(

                `Orbes: ${collected} / 10`

            );


            if(collected >= 10){

                endGame(
                    'GANASTE'
                );

            }

        }

    });

}


// ======================================
// IA FANTASMA
// ======================================

function animateGhost(dt){

    if(!ghost || gameOver)
        return;


    const distance =

    ghost.position.distanceTo(
        playerRig.position
    );


    ghost.lookAt(
        playerRig.position
    );


    // MUCHO MAS RAPIDO

    let speed = 2.2;

    speed +=
    collected * 0.35;


    const direction =
    new THREE.Vector3();

    direction.subVectors(

        playerRig.position,

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


    if(distance < 2){

        endGame(
            'GAME OVER'
        );

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