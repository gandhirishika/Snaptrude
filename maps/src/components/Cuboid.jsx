import React, { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

const Cuboid = ({ imageURL }) => {
  const babylonContainerRef = useRef(null);
  const cuboidRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  // const sphereRef = useRef(null);

  useEffect(() => {
    if (babylonContainerRef.current && imageURL) {
      const canvas = babylonContainerRef.current;
      const engine = new BABYLON.Engine(canvas, true);
      engineRef.current = engine;

      const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        sceneRef.current = scene;

        const camera = new BABYLON.ArcRotateCamera(
          'camera',
          -Math.PI / 2, 
          Math.PI / 2, 
          10, 
          BABYLON.Vector3.Zero(),
          scene
        );
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0,0,0), scene);
        light.intensity = 0.7;

        const cuboid = BABYLON.MeshBuilder.CreateBox('cuboid', { width: 4, height: 6, depth: 3 }, scene);
        cuboidRef.current = cuboid;


        // const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 6 }, scene); // Change to sphere
        // sphereRef.current = sphere;

       


        const material = new BABYLON.StandardMaterial('material', scene);
        material.diffuseTexture = new BABYLON.Texture(imageURL, scene);
        cuboid.material = material;
        // sphere.material = material;

        return scene;
      };

      const scene = createScene();

      engine.runRenderLoop(() => {
        scene.render();
      });

      return () => {
        engine.stopRenderLoop();
        engine.dispose();
      };
    }
  }, [imageURL]);

  return <canvas ref={babylonContainerRef} className='cuboid-canvas' />;
};

export default Cuboid;
