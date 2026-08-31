import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { FontLoader } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FontLoader.js";

import { TextGeometry } from
"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/TextGeometry.js";


/* =====================================================
   SETUP
===================================================== */

const container = document.getElementById("andigital-3d");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x171719);


/* CAMERA */

const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);

camera.position.set(
    0,
    0,
    1050
);


/* RENDERER */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);


/* =====================================================
   LIGHTS
===================================================== */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.2
);

scene.add(ambientLight);


const purpleLight = new THREE.PointLight(
    0xa855ff,
    8,
    1200
);

purpleLight.position.set(
    0,
    0,
    300
);

scene.add(purpleLight);


const whiteLight = new THREE.PointLight(
    0xffffff,
    4,
    1000
);

whiteLight.position.set(
    -400,
    300,
    500
);

scene.add(whiteLight);


/* =====================================================
   MAIN 3D GROUP
===================================================== */

const textGroup = new THREE.Group();

scene.add(textGroup);


/* =====================================================
   MATERIALS
===================================================== */

const frontMaterial = new THREE.MeshStandardMaterial({
    color: 0x68696d,

    metalness: 0.15,

    roughness: 0.65
});


const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x292a2e,

    metalness: 0.2,

    roughness: 0.7
});


/* =====================================================
   FONT
===================================================== */

const loader = new FontLoader();

loader.load(

    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json",

    function(font) {

        createCurvedText(font);

    }

);


/* =====================================================
   CREATE CURVED TEXT
===================================================== */

function createCurvedText(font) {

    const word = "ANDIGITAL";

    const radius = 470;

    const letterSpacing = 0.19;

    const textSize = 150;

    const repetitions = 3;


    for (
        let repetition = 0;
        repetition < repetitions;
        repetition++
    ) {

        const group = new THREE.Group();

        const offset =
            repetition *
            Math.PI *
            2 /
            repetitions;


        for (
            let i = 0;
            i < word.length;
            i++
        ) {

            const char = word[i];


            /* TEXT GEOMETRY */

            const geometry = new TextGeometry(
                char,
                {
                    font: font,

                    size: textSize,

                    depth: 32,

                    curveSegments: 12,

                    bevelEnabled: true,

                    bevelThickness: 4,

                    bevelSize: 2,

                    bevelSegments: 3
                }
            );


            geometry.computeBoundingBox();


            const width =
                geometry.boundingBox.max.x -
                geometry.boundingBox.min.x;


            /* ANGLE */

            const angle =
                (i - (word.length - 1) / 2)
                * letterSpacing
                + offset;


            /* POSITION ON CYLINDER */

            const x =
                Math.sin(angle) * radius;

            const z =
                Math.cos(angle) * radius;


            /* MESH */

            const mesh =
                new THREE.Mesh(
                    geometry,
                    [
                        frontMaterial,
                        sideMaterial
                    ]
                );


            mesh.position.set(
                x,
                -80,
                z
            );


            /*
             * Rotate every letter so
             * it follows the cylinder
             */

            mesh.rotation.y = angle;


            /*
             * Small vertical variation
             * gives more organic depth
             */

            mesh.rotation.x =
                Math.sin(angle * 2) * 0.035;


            group.add(mesh);

        }


        textGroup.add(group);

    }


    /* =================================================
       CENTRAL PURPLE OBJECT
    ================================================= */

    const sphereGeometry =
        new THREE.SphereGeometry(
            75,
            64,
            64
        );


    const sphereMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x9b4dff,

            emissive: 0x6f20d8,

            emissiveIntensity: 1.4,

            metalness: 0.25,

            roughness: 0.25

        });


    const sphere =
        new THREE.Mesh(
            sphereGeometry,
            sphereMaterial
        );


    sphere.position.set(
        0,
        -40,
        300
    );


    scene.add(sphere);


    /* =================================================
       PURPLE RING
    ================================================= */

    const ringGeometry =
        new THREE.TorusGeometry(
            95,
            4,
            20,
            100
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xa855ff
        });


    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    ring.position.copy(
        sphere.position
    );


    ring.rotation.x =
        Math.PI / 2;


    scene.add(ring);


    animate(
        sphere,
        ring
    );

}


/* =====================================================
   MOUSE
===================================================== */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;


window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (event.clientX /
                window.innerWidth -
                0.5);

        mouseY =
            (event.clientY /
                window.innerHeight -
                0.5);

    }
);


/* =====================================================
   SCROLL
===================================================== */

let scrollVelocity = 0;

let previousScroll = window.scrollY;


window.addEventListener(
    "scroll",
    () => {

        const currentScroll =
            window.scrollY;

        scrollVelocity =
            currentScroll -
            previousScroll;

        previousScroll =
            currentScroll;

    }
);


/* =====================================================
   ANIMATION
===================================================== */

function animate(
    sphere,
    ring
) {

    requestAnimationFrame(
        () =>
            animate(
                sphere,
                ring
            )
    );


    /* ================================================
       INFINITE ROTATION
    ================================================ */

    textGroup.rotation.y +=
        0.0025;


    /* ================================================
       MOUSE MOVEMENT
    ================================================ */

    targetX =
        mouseX * 0.18;

    targetY =
        mouseY * 0.12;


    textGroup.rotation.x +=
        (
            targetY -
            textGroup.rotation.x
        ) * 0.025;


    textGroup.rotation.z +=
        (
            targetX -
            textGroup.rotation.z
        ) * 0.025;


    /* ================================================
       SCROLL EFFECT
    ================================================ */

    textGroup.rotation.y +=
        scrollVelocity * 0.0008;


    scrollVelocity *= 0.92;


    /* ================================================
       PURPLE OBJECT
    ================================================ */

    sphere.rotation.x += 0.006;

    sphere.rotation.y += 0.009;

    ring.rotation.z += 0.01;


    /* Floating effect */

    sphere.position.y =
        -40 +
        Math.sin(
            Date.now() * 0.0015
        ) * 10;


    /* ================================================
       RENDER
    ================================================ */

    renderer.render(
        scene,
        camera
    );

}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

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