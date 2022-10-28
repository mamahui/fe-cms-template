import { createContext, useContext } from 'react';

export interface PromptContextValue {
  setPrompt: (state: boolean) => void;
  block: () => boolean;
}
export const PromptContext = createContext<PromptContextValue>({ setPrompt: () => undefined, block: () => false });

function usePrompt(): PromptContextValue {
  return useContext(PromptContext);
}

export default usePrompt;
