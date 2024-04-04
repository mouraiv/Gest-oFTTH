import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeModelViewer = ({ viewer }) => {
  const canvasRef = useRef();

  useEffect(() => {
    // Configura a cena, a câmera e o renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adiciona uma luz à cena
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Converte a string base64 de volta para um ArrayBuffer
    const binaryString = atob(viewer);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    // Carrega o modelo 3D
    const loader = new GLTFLoader();
    loader.parse(JSON.stringify(arrayBuffer), '', (gltf) => {
      scene.add(gltf.scene);
    });

    // Atualiza a posição da câmera
    camera.position.z = 1;

    // Função para animar o modelo
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Limpa o canvas quando o componente for desmontado
    return () => {
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ThreeModelViewer;
