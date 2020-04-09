import React, { useContext, useRef, useEffect, Suspense } from "react";
import styles from "./Renderer.module.scss";
import { ARContext } from ".";
import { Canvas } from "react-three-fiber";
import Scene from "../Scene";

export default () => {
  const { stream } = useContext(ARContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  if (!stream) return null;

  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
  }, [stream, videoRef]);

  return (
    <div className={styles.root}>
      <video autoPlay ref={videoRef} className={styles.video} />
      <Canvas className={styles.canvas}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};