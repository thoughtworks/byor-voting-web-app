import { VotingEvent } from '../models/voting-event';

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

export function getActionRoute(votingEvent: VotingEvent) {
  const actionName = getActionName(votingEvent);
  let route: string;
  if (actionName === 'vote') {
    route = 'vote';
  } else if (actionName === 'conversation') {
    route = 'conversation';
  } else {
    throw new Error(`No route defined for action name "${actionName}"`);
  }
  return route;
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
