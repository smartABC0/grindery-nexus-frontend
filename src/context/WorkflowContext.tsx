import React, { useState, createContext, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { Workflow } from "../types/Workflow";
import { Action, Connector, Field, Trigger } from "../types/Connector";
import { defaultFunc, jsonrpcObj } from "../utils";
import { WORKFLOW_ENGINE_URL } from "../constants";
import useAppContext from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";

// empty workflow declaration
const blankWorkflow: Workflow = {
  title: "New workflow",
  trigger: {
    type: "trigger",
    connector: "",
    operation: "",
    input: {},
  },
  actions: [
    {
      type: "action",
      connector: "",
      operation: "",
      input: {},
    },
  ],
  creator: "",
};

type WorkflowContextProps = {
  connectors: Connector[];
  workflow: Workflow;
  activeStep: number | string;
  loading: boolean;
  error?: string | null;
  success: string | null;
  setActiveStep: (a: any) => void;
  setLoading: (a: boolean) => void;
  setError: (a: string) => void;
  setSuccess: (a: string) => void;
  setWorkflow: (a: any) => void;
  saveWorkflow: () => void;
  resetWorkflow: () => void;
  updateWorkflow: (a: any) => void;
  setConnectors: (a: Connector[]) => void;
  triggers: {
    current?: Trigger;
    triggerConnector?: Connector;
    triggerIsSet: boolean;
    triggerConnectorIsSet: boolean;
    triggerAuthenticationIsRequired: boolean;
    triggerIsAuthenticated: boolean;
    triggerIsConfigured: boolean;
    availableTriggers: Trigger[];
    connectorsWithTriggers: Connector[];
  };
  actions: {
    current: (i: number) => Action | undefined;
    actionConnector: (i: number) => Connector | undefined;
    actionIsSet: (i: number) => boolean;
    actionConnectorIsSet: (i: number) => boolean;
    actionAuthenticationIsRequired: (i: number) => boolean;
    actionIsAuthenticated: (i: number) => boolean;
    actionIsConfigured: (i: number) => boolean;
    availableActions: (i: number) => Action[];
    connectorsWithActions: Connector[];
  };
};

type WorkflowContextProviderProps = {
  children: React.ReactNode;
  user: string | null;
};

export const WorkflowContext = createContext<WorkflowContextProps>({
  connectors: [],
  workflow: blankWorkflow,
  activeStep: 1,
  loading: false,
  success: null,
  setActiveStep: defaultFunc,
  setConnectors: defaultFunc,
  setWorkflow: defaultFunc,
  saveWorkflow: defaultFunc,
  resetWorkflow: defaultFunc,
  updateWorkflow: defaultFunc,
  setLoading: defaultFunc,
  setError: defaultFunc,
  setSuccess: defaultFunc,
  triggers: {
    triggerIsSet: false,
    triggerConnectorIsSet: false,
    triggerAuthenticationIsRequired: false,
    triggerIsAuthenticated: false,
    triggerIsConfigured: false,
    availableTriggers: [],
    connectorsWithTriggers: [],
  },
  actions: {
    current: () => undefined,
    actionConnector: () => undefined,
    actionIsSet: () => false,
    actionConnectorIsSet: () => false,
    actionAuthenticationIsRequired: () => false,
    actionIsAuthenticated: () => false,
    actionIsConfigured: () => false,
    availableActions: () => [],
    connectorsWithActions: [],
  },
});

export const WorkflowContextProvider = ({
  user,
  children,
}: WorkflowContextProviderProps) => {
  let navigate = useNavigate();
  const { getWorkflowsList, connectors: availableConnectors } = useAppContext();

  // loaded nexus connectors CDS
  const [connectors, setConnectors] = useState<Connector[]>(
    availableConnectors || []
  );

  // workflow state
  const [workflow, setWorkflow] = useState<Workflow>({
    title: "New workflow",
    trigger: {
      type: "trigger",
      connector: "",
      operation: "",
      input: {},
    },
    actions: [
      {
        type: "action",
        connector: "",
        operation: "",
        input: {},
      },
    ],
    creator: "",
  });

  // is data loading
  const [loading, setLoading] = useState(false);

  // error message
  const [error, setError] = useState<string | null>(null);

  // success message
  const [success, setSuccess] = useState<string | null>(null);

  // active workflow builde step
  const [activeStep, setActiveStep] = useState<string | number>(1);

  // filter connectors that has triggers
  const connectorsWithTriggers = connectors.filter(
    (connector) =>
      connector && connector.triggers && connector.triggers.length > 0
  );

  // filter connectors that has actions
  const connectorsWithActions = connectors.filter(
    (connector) =>
      connector && connector.actions && connector.actions.length > 0
  );

  // check if trigger connector is selected
  const triggerConnectorIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.connector
  );

  // check if action connector is selected
  const actionConnectorIsSet = (index: number) =>
    Boolean(
      workflow &&
        workflow.actions &&
        workflow.actions[index] &&
        workflow.actions[index].connector
    );

  // check if trigger operation is selected
  const triggerIsSet = Boolean(
    workflow && workflow.trigger && workflow.trigger.operation
  );

  // check if action operation is selected
  const actionIsSet = (index: number) =>
    Boolean(
      workflow &&
        workflow.actions &&
        workflow.actions[index] &&
        workflow.actions[index].operation
    );

  // current workflow's trigger connector key
  const workflowTriggerConnector = workflow.trigger.connector;

  // current workflow's trigger operation key
  const workflowTriggerOperation = workflow.trigger.operation;

  // current workflow's action connector key
  const workflowActionConnector = (index: number) =>
    workflow.actions[index].connector;

  // current workflow's action operation key
  const workflowActionOperation = (index: number) =>
    workflow.actions[index].operation;

  // current trigger's connector object
  const triggerConnector = connectors.find(
    (connector) =>
      connector && connector.key && connector.key === workflowTriggerConnector
  );

  // current trigger object
  const trigger = triggerConnector?.triggers?.find(
    (connectorTrigger: { key: any }) =>
      connectorTrigger && connectorTrigger.key === workflowTriggerOperation
  );

  // current action's connector object
  const actionConnector = (index: number) =>
    connectors.find(
      (connector) =>
        connector &&
        connector.key &&
        connector.key === workflowActionConnector(index)
    );

  // current action object
  const action = (index: number) =>
    actionConnector(index)?.actions?.find(
      (connectorAction: { key: any }) =>
        connectorAction &&
        connectorAction.key === workflowActionOperation(index)
    );

  // chech if trigger is authenticated (if required)
  const triggerIsAuthenticated = Boolean(
    (triggerConnector && !triggerConnector.authentication) ||
      (workflow.trigger?.credentials && triggerConnector?.authentication)
  );

  const actionIsAuthenticated = (index: number) =>
    Boolean(
      (actionConnector(index) && !actionConnector(index)?.authentication) ||
        (workflow.actions[index]?.credentials &&
          actionConnector(index)?.authentication)
    );

  // list trigger's required field names
  const requiredTriggerFields =
    (trigger &&
      trigger.operation &&
      trigger.operation.inputFields &&
      trigger.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
    [];

  // check if trigger is configured (all required fields is set)
  const triggerIsConfigured = Boolean(
    requiredTriggerFields.filter(
      (field: string) =>
        workflow &&
        workflow.trigger &&
        workflow.trigger.input &&
        typeof workflow.trigger.input[field] !== "undefined" &&
        workflow.trigger.input[field] !== "" &&
        workflow.trigger.input[field] !== null
    ).length === requiredTriggerFields.length &&
      (trigger &&
      trigger.operation &&
      trigger.operation.type === "blockchain:event"
        ? workflow.trigger.input._grinderyChain &&
          workflow.trigger.input._grinderyContractAddress
        : true)
  );

  // list action's required field names
  const requiredActionFields = (index: number) => {
    return (
      (action(index)?.operation?.inputFields || [])
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key) || []
    );
  };

  // check if action is configured (all required fields is set)
  const actionIsConfigured = (index: number) => {
    return Boolean(
      requiredActionFields(index).filter(
        (field: string) => workflow.actions[index]?.input?.[field]
      ).length === requiredActionFields(index).length &&
        (action(index)?.operation?.type === "blockchain:call"
          ? workflow.actions[index].input._grinderyChain &&
            workflow.actions[index].input._grinderyContractAddress &&
            workflow.actions[index].input._grinderyGasLimit
          : true)
    );
  };

  // current trigger's connector object
  const selectedTriggerConnector = connectorsWithTriggers.find(
    (connector) =>
      connector && connector.key && connector.key === workflow.trigger.connector
  );

  // current action's connector object
  const selectedActionConnector = (index: number) =>
    connectorsWithActions.find(
      (connector) =>
        connector &&
        connector.key &&
        connector.key === workflow.actions[index].connector
    );

  // list available triggers for the selected connector
  const availableTriggers =
    (triggerConnectorIsSet &&
      selectedTriggerConnector &&
      selectedTriggerConnector.triggers) ||
    [];

  // list available actions for the selected connector
  const availableActions = (index: number) =>
    (triggerConnectorIsSet && selectedActionConnector(index)?.actions) || [];

  // check if trigger authentication is required
  const triggerAuthenticationIsRequired = Boolean(
    triggerConnector && triggerConnector.authentication
  );

  // check if action authentication is required
  const actionAuthenticationIsRequired = (index: number) =>
    Boolean(actionConnector(index) && actionConnector(index)?.authentication);

  const triggers = {
    current: trigger,
    triggerConnector,
    triggerIsSet,
    triggerConnectorIsSet,
    triggerAuthenticationIsRequired,
    triggerIsAuthenticated,
    triggerIsConfigured,
    availableTriggers,
    connectorsWithTriggers,
  };

  const actions = {
    current: action,
    actionConnector,
    actionIsSet,
    actionConnectorIsSet,
    actionAuthenticationIsRequired,
    actionIsAuthenticated,
    actionIsConfigured,
    availableActions,
    connectorsWithActions,
  };

  // update current workflow
  const updateWorkflow = (data: any) => {
    let newWorkflow = { ...workflow };
    Object.keys(data).forEach((path) => {
      _.set(newWorkflow, path, data[path]);
    });
    setWorkflow(newWorkflow);
  };

  // reset current workflow
  const resetWorkflow = () => {
    setWorkflow({ ...blankWorkflow, creator: user || "" });
    setActiveStep(1);
  };

  const saveWorkflow = () => {
    if (workflow) {
      const readyWorkflow = {
        ...workflow,
        signature: JSON.stringify(workflow),
      };
      if (window.location.origin.includes("http://localhost")) {
        console.log("readyWorkflow", readyWorkflow);
      }
      setError(null);
      setSuccess(null);
      setLoading(true);
      axios
        .post(
          WORKFLOW_ENGINE_URL,
          jsonrpcObj("or_createWorkflow", {
            userAccountId: readyWorkflow.creator,
            workflow: readyWorkflow,
          })
        )
        .then((res) => {
          if (res && res.data && res.data.error) {
            setError(res.data.error.message || null);
          }
          if (res && res.data && res.data.result) {
            getWorkflowsList();
            resetWorkflow();
            navigate("/workflows");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || null);
          setLoading(false);
        });
    }
  };

  // set user id on success authentication
  useEffect(() => {
    if (user) {
      updateWorkflow({
        creator: user,
      });
    } else {
      updateWorkflow({
        creator: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (window.location.origin.includes("http://localhost")) {
    console.log("connectors", connectors);
    console.log("workflow", workflow);
  }

  return (
    <WorkflowContext.Provider
      value={{
        connectors,
        workflow,
        activeStep,
        loading,
        error,
        success,
        setActiveStep,
        setConnectors,
        setWorkflow,
        saveWorkflow,
        resetWorkflow,
        updateWorkflow,
        setLoading,
        setError,
        setSuccess,
        triggers,
        actions,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContextProvider;
