import React from "react";
import ConnectorsSelector from "./ConnectorsSelector";
import ActionConfiguration from "./ActionConfiguration";
import { useAppContext } from "../context/AppContext";
import TriggerConfiguration from "./TriggerConfiguration";

type Props = {};

const WorkflowConstructor = (props: Props) => {
  const {
    triggerIsSet,
    actionIsSet,
    triggerIsAuthenticated,
    triggerIsConfigured,
  } = useAppContext();

  return (
    <div style={{ padding: "0 20px 50px" }}>
      <ConnectorsSelector />
      {triggerIsSet && actionIsSet && <TriggerConfiguration />}
      {triggerIsSet &&
        actionIsSet &&
        triggerIsAuthenticated &&
        triggerIsConfigured && <ActionConfiguration index={0} />}
    </div>
  );
};

export default WorkflowConstructor;
