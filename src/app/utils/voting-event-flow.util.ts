import { VotingEvent } from '../models/voting-event';
import { BackendService } from '../services/backend.service';

export function getIdentificationType(votingEvent: VotingEvent) {
  return getFlowStep(votingEvent).identification.name;
}

export function getIdentificationRoute(votingEvent: VotingEvent) {
  const identificationType = getIdentificationType(votingEvent);
  let route: string;
  if (identificationType === 'login') {
    route = 'login-voting-event';
  } else if (identificationType === 'nickname') {
    route = 'nickname';
  } else {
    throw new Error(`No route defined for identification type ${identificationType}`);
  }
  return route;
}

export function getAction(votingEvent: VotingEvent) {
  return getFlowStep(votingEvent).action;
}

export function getActionName(votingEvent: VotingEvent) {
  return getFlowStep(votingEvent).action.name;
}

export function getNextAction(votingEvent: VotingEvent) {
  const nextFlowStep = getNextFlowStep(votingEvent);
  return nextFlowStep ? nextFlowStep.action : null;
}
export function getNextActionName(votingEvent: VotingEvent) {
  const nextAction = getNextAction(votingEvent);
  return nextAction ? nextAction.name : null;
}

export function getActionRoute(votingEvent: VotingEvent) {
  const actionName = getActionName(votingEvent);
  let route: string;
  if (actionName === 'vote') {
    route = 'vote/start';
  } else if (actionName === 'conversation') {
    route = 'conversation';
  } else if (actionName === 'recommendation') {
    route = 'recommendation';
  } else {
    throw new Error(`No route defined for action name "${actionName}"`);
  }
  return route;
}

export function getFlowStepName(votingEvent: VotingEvent) {
  return getFlowStep(votingEvent).name;
}

function getFlowStep(votingEvent: VotingEvent) {
  if (!votingEvent.flow) {
    throw new Error(`Voting Event ${votingEvent.name} does not have a flow defined`);
  }
  const round = votingEvent.round ? votingEvent.round : 1;
  if (votingEvent.flow.steps.length < round) {
    throw new Error(`Voting Event ${votingEvent.name} does not have a step defined in its flow for round ${round}`);
  }
  return votingEvent.flow.steps[round - 1];
}
function getNextFlowStep(votingEvent: VotingEvent) {
  if (!votingEvent.flow) {
    throw new Error(`Voting Event ${votingEvent.name} does not have a flow defined`);
  }
  const round = votingEvent.round ? votingEvent.round : 1;
  return votingEvent.flow.steps.length > round ? votingEvent.flow.steps[round] : null;
}
