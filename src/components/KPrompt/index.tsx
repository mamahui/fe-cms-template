import { useState, useEffect } from 'react';
import { Prompt } from 'umi';
import type { IRouteComponentProps } from 'umi';
import usePrompt, { PromptContext } from './usePrompt';

export { usePrompt };

const LEAVE_MESSAGE = '离开当前页后，所编辑的数据将不可恢复';

export interface HPromptProps {
  children?: React.ReactNode;
  location: IRouteComponentProps['location'];
}
const KPrompt: React.FC<HPromptProps> = ({ children, location }) => {
  const [prompt, setPrompt] = useState(false);
  // 手动调用展示prompt提示，仅在路由没有变更导致umi的Prompt失效时才调用
  const block = () => {
    if (prompt) {
      // eslint-disable-next-line no-alert
      return window.confirm(LEAVE_MESSAGE);
    }
    return true;
  };

  useEffect(() => {
    setPrompt(false);
  }, [location]);

  return (
    <PromptContext.Provider value={{ setPrompt, block }}>
      {children}
      <Prompt when={prompt} message={() => LEAVE_MESSAGE} />
    </PromptContext.Provider>
  );
};

export default KPrompt;
