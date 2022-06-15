import React from "react";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import { useAppContext } from "../../context/AppContext";
import TriggerConfiguration from "./TriggerConfiguration";
import WorkflowProgress from "./WorkflowProgress";

type Props = {};

const WorkflowConstructor = (props: Props) => {
  const {
    triggerIsSet,
    actionIsSet,
    triggerIsAuthenticated,
    triggerIsConfigured,
    resetWorkflow,
    setWorkflowOpened,
  } = useAppContext();

  const closeConstructor = () => {
    setWorkflowOpened?.(false);
    resetWorkflow?.();
  };

  return (
    <div>
      <WorkflowProgress />
      <ConnectorsSelector step={1} />
      {triggerIsSet && actionIsSet && <TriggerConfiguration step={2} />}
      {triggerIsSet &&
        actionIsSet &&
        triggerIsAuthenticated &&
        triggerIsConfigured && (
          <ActionConfiguration
            index={0}
            step={3}
            closeConstructor={closeConstructor}
          />
        )}
    </div>
  );
};

export default WorkflowConstructor;
