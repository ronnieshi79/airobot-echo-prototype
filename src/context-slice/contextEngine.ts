import { ContextComputationParams, ContextComputationResult } from '../services/agent/types';
import { detectAutoContext, computeContextSlices } from '../services/agent/contextReasoning';

export { detectAutoContext };

/**
 * Backward compatible alias for computeContextSlices
 */
export function getContextServiceSlices(params: ContextComputationParams): ContextComputationResult {
  return computeContextSlices(params);
}
