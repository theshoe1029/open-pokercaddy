import * as THREE from 'three';
import React from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";

let animate, camera, controls, scene, renderer, mixer;
const clock = new THREE.Clock();

interface LogoProps {
    width: number;
    height: number;
}

export class Logo extends React.Component<LogoProps, any> {
    domElement: HTMLCanvasElement;

    constructor(props) {
        super(props);

        camera = new THREE.PerspectiveCamera(22.9, 1.28, 0.01, 1000);
        scene = new THREE.Scene();
        scene.background = null;
        animate = true;

        let lightAmb = new THREE.AmbientLight(0xffffff);
        scene.add(lightAmb);

        const loader = new GLTFLoader();
        loader.load( '/logo.glb', function (gltf) {
            mixer = new THREE.AnimationMixer(gltf.scene);
            mixer.clipAction(gltf.animations[0]).setDuration(7).play();

            const cameraPos = gltf.cameras[0].position;
            camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

            scene.add(gltf.scene);

            const animation = () => {
                requestAnimationFrame(animation);
                if (controls) controls.update();
                const delta = clock.getDelta();
                if (animate) mixer.update(delta);
                renderer.render(scene, camera);
            }
            animation();
        }, 	null, function (error) {
            console.error(error);
        } );

        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setSize(this.props.width, this.props.height);
        this.domElement = renderer.domElement;
    }

    componentDidMount() {
        const element = document.getElementById('canvas');
        element.parentNode.replaceChild(this.domElement, element);
        this.domElement.classList.add("pointer-cursor");
        this.domElement.setAttribute("style", `width: ${this.props.width}px; height: ${this.props.height}px`);
        this.domElement.addEventListener("mousedown", () => animate = false);
        this.domElement.addEventListener("mouseup", () => animate = true);

        controls = new TrackballControls(camera, renderer.domElement);
        controls.noPan = true;
        controls.noZoom = true;
        controls.rotateSpeed = 2.0;
    }

    render() {
        return <div id="logo"><div id="canvas"></div></div>;
    }
}
export default Logo;
