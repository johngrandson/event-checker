import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

const addedRules = new Set<string>();
const ONE_SECOND_IN_MILLISECONDS = 1000;

interface RateLimitRule {
  type: 'method' | 'subscription';
  name: string;
  numRequests: number;
  timeInterval: number;
}

const rules: RateLimitRule[] = [
  {
    type: 'method',
    name: 'communities.getById',
    numRequests: 20,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 2,
  },
  {
    type: 'method',
    name: 'communities.getAll',
    numRequests: 5,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'method',
    name: 'people.insert',
    numRequests: 10,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 60,
  },
  {
    type: 'method',
    name: 'people.getById',
    numRequests: 30,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 60,
  },
  {
    type: 'method',
    name: 'people.getTotalByCommunityId',
    numRequests: 15,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 60,
  },
  {
    type: 'method',
    name: 'people.getAll',
    numRequests: 10,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'method',
    name: 'people.getAllByCommunityId',
    numRequests: 10,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'method',
    name: 'people.getAllByCommunityIdCheckedIn',
    numRequests: 5,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'method',
    name: 'people.getAllByCommunityIdCheckedOut',
    numRequests: 5,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'method',
    name: 'people.checkIn',
    numRequests: 5,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 60,
  },
  {
    type: 'method',
    name: 'people.checkOut',
    numRequests: 5,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 60,
  },
  {
    type: 'subscription',
    name: 'people.getAllByCommunityId',
    numRequests: 10,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'subscription',
    name: 'people.getAllByCommunityIdCheckedIn',
    numRequests: 5,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'subscription',
    name: 'people.getAllByCommunityIdCheckedOut',
    numRequests: 10,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
  {
    type: 'subscription',
    name: 'people.getTotalByCommunityId',
    numRequests: 10,
    timeInterval: ONE_SECOND_IN_MILLISECONDS * 10,
  },
];

function validateRule(rule: RateLimitRule) {
  if (!rule.type || !rule.name || !rule.numRequests || !rule.timeInterval) {
    throw new Error(`Invalid rule configuration: ${JSON.stringify(rule)}`);
  }

  if (!['method', 'subscription'].includes(rule.type)) {
    throw new Error(`Invalid rule type: ${rule.type}`);
  }
}

function logRateLimitStatus(
  type: string,
  name: any,
  message: string,
  isSuccess = true
) {
  const logMessage = `${type.toUpperCase()} - ${name}: ${message}`;
  isSuccess ? console.log(logMessage) : console.error(logMessage);
}

function addRateLimitRule(
  rule: { type: any; name: any; numRequests: number; timeInterval: number },
  ruleKey: string
) {
  const added = DDPRateLimiter.addRule(
    {
      type: rule.type,
      name: rule.name,
      connectionId: () => true,
    },
    rule.numRequests,
    rule.timeInterval
  );

  if (added) {
    addedRules.add(ruleKey);
    logRateLimitStatus(
      rule.type,
      rule.name,
      `Rate limiter added (Limit: ${rule.numRequests} req/${rule.timeInterval} ms)`
    );
  } else {
    logRateLimitStatus(
      rule.type,
      rule.name,
      'Failed to add rate limiter',
      false
    );
  }
}

export function loadRateLimitRules() {
  for (const rule of rules) {
    try {
      validateRule(rule);
      const ruleKey = `${rule.type}:${rule.name}`;

      if (addedRules.has(ruleKey)) {
        logRateLimitStatus(rule.type, rule.name, 'Rule already exists');
        continue;
      }

      addRateLimitRule(rule, ruleKey);
    } catch (error: Error | any) {
      logRateLimitStatus(rule.type, rule.name, error.message, false);
    }
  }
}
