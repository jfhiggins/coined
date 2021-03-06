import React, { memo, useContext, useEffect } from "react";
import styles from "./index.module.scss";
import Button from "../../components/Button";
import { SessionContext } from "../../components/Session";
import { motion } from "framer-motion";
import { AssetContext } from "../../components/AssetLoader";
import { DEBUG_SCANNING } from "../../config";

const Welcome = memo(() => {
  const { updateSessionState } = useContext(SessionContext);
  const { sfx } = useContext(AssetContext);
  useEffect(() => {
    const sound = sfx["intro"];
    const soundId = sound.play();
    sound.once("end", () => {
      updateSessionState((s) => {
        if (!DEBUG_SCANNING) s.phase = "category";
      });
    });
    return () => {
      sound.stop(soundId);
    };
  }, [sfx, updateSessionState]);

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button
        text="PLAY"
        onClick={() =>
          updateSessionState((s) => {
            s.phase = "category";
          })
        }
      />
    </motion.div>
  );
});

export default Welcome;
