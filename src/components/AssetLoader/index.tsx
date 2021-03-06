import React, {
  memo,
  ReactNode,
  createContext,
  useState,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
import Logo from "./Logo";
import preloadImages from "./preloadImages";
import preloadAudio from "./preloadAudio";
import preloadQuestions from "./preloadQuestions";
import preloadModels from "./preloadModels";
import waitForSeconds from "../../util/waitForSeconds";

type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never;

export type AssetContextType = {
  models: PromiseResolvedType<ReturnType<typeof preloadModels>>;
  questions: PromiseResolvedType<ReturnType<typeof preloadQuestions>>;
  sfx: PromiseResolvedType<ReturnType<typeof preloadAudio>>;
};
//@ts-ignore
const defaultAssetContext: AssetContextType = {};
export const AssetContext = createContext(defaultAssetContext);

const Preloader = memo((props: { children: ReactNode }) => {
  const { children } = props;
  const [isStarted, setStarted] = useState(false);
  const [models, setModels] = useState<AssetContextType["models"]>();
  const [questions, setQuestions] = useState<AssetContextType["questions"]>();
  const [sfx, setSfx] = useState<AssetContextType["sfx"]>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      var step = 0;
      const totalSteps = 4;

      await waitForSeconds(1.5);

      setQuestions(await preloadQuestions());
      step++;
      setProgress(step);
      await preloadImages((pct) => setProgress((step + pct) / totalSteps));
      step++;
      setModels(
        await preloadModels((pct) => setProgress((step + pct) / totalSteps))
      );
      step++;
      setSfx(
        await preloadAudio((pct) => setProgress((step + pct) / totalSteps))
      );
    })();
  }, [setProgress]);

  //TODO: if loading and model or questions arent present should throw error
  return (
    <>
      <Logo />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: { when: "beforeChildren" },
          }}
          exit={{
            opacity: 0,
            transition: { when: "afterChildren" },
          }}
          key={isStarted ? "started" : "loading"}
        >
          {!isStarted ? (
            <LoadingScreen
              progress={progress}
              onStart={() => setStarted(true)}
            />
          ) : !questions || !models || !sfx ? (
            <></>
          ) : (
            <AssetContext.Provider value={{ questions, models, sfx }}>
              {children}
            </AssetContext.Provider>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
});

export default Preloader;
