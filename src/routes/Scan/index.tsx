import React, { memo, useContext, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { ARContext } from "../../components/ARBridge";
import { SessionContext } from "../../components/Session";
import { ReactComponent as ScannerSvg } from "../../media/scanner.svg";
import { ReactComponent as ScanPromptSvg } from "../../media/scanPrompt.svg";
import { ReactComponent as ScanFadeSvg } from "../../media/scanFade.svg";
import { motion } from "framer-motion";
import useKeyPress from "../../hooks/useKeyPress";
import { AssetContext } from "../../components/AssetLoader";

const Scan = memo(() => {
  const { updateSessionState } = useContext(SessionContext);
  const { arController } = useContext(ARContext);
  const { models } = useContext(AssetContext);
  const hasScanned = useRef(false);

  useEffect(() => {
    if (arController) {
      arController.isCoinDetectionEnabled = true;

      const listener = () => {
        if (hasScanned.current) return;
        hasScanned.current = true;

        arController.george.model.visible = true;
        arController.george.playAnimation(models["appear"].animations[0]);

        setTimeout(() => {
          //arController.isCoinDetectionEnabled = false;
          updateSessionState((s) => {
            s.phase = "intro";
          });
        }, 3000);
      };

      arController.events.addEventListener("onDetectStart", listener);
      return () => {
        arController.events.removeEventListener("onDetectStart", listener);
      };
    }
  }, [arController, updateSessionState, hasScanned, models]);

  //skip scanning for quick debugging
  useKeyPress("q", () => {
    updateSessionState((s) => {
      s.phase = "intro";
    });
  });

  return (
    <>
      <motion.div
        className={styles.scanFade}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ScanFadeSvg />
      </motion.div>
      <motion.div
        className={styles.scanner}
        initial={{
          opacity: 0,
          scale: 0.95,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          translateX: "-50%",
          translateY: "-50%",
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <ScannerSvg />
      </motion.div>
      <motion.div
        className={styles.scanPrompt}
        initial={{
          opacity: 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: 1,
          translateX: "-50%",
          translateY: "-50%",
        }}
        exit={{
          opacity: 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <ScanPromptSvg />
      </motion.div>
    </>
  );
});

export default Scan;
