import React, { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

const Cuboid = ({ imageURL }) => {
  const babylonContainerRef = useRef(null);
  const cuboidRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const materialRef = useRef(null);

  useEffect(() => {
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

      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 0, 0), scene);
      light.intensity = 0.7;

      const cuboid = BABYLON.MeshBuilder.CreateBox('cuboid', { width: 4, height: 6, depth: 3 }, scene);
      cuboidRef.current = cuboid;
      console.log("cubboid")

      const material = new BABYLON.StandardMaterial('material', scene);
      materialRef.current = material;
      cuboid.material = material;
      console.log("material");
      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(() => {
      console.log("scene")
      scene.render();
    });

    return () => {
      engine.stopRenderLoop();
      console.log("remove");
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (materialRef.current && imageURL) {
      const texture = new BABYLON.Texture(imageURL, sceneRef.current);
      materialRef.current.diffuseTexture = texture;
      console.log("textur");
    }
  }, [imageURL]);

  return <canvas ref={babylonContainerRef} className='cuboid-canvas' />;
};

export default Cuboid;