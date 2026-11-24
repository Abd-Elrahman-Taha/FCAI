/**
 * Policy, Credit Load Rules, Grade Scale & Secondary Track Requirements Service (17 endpoints)
 *
 * - PolicyVersions (7)
 * - CreditLoadRules (2)
 * - GradeScaleVersions (5)
 * - SecondaryTrackRequirements (3)
 */

import { apiClient, ApiError } from './apiClient';
import { ADMIN_ENDPOINTS } from './endpoints';
import type {
  ActivateGradeScaleResponse,
  CreateGradeScaleVersionRequest,
  CreatePolicyVersionRequest,
  CreditLoadRulesDto,
  GradeScaleVersionDto,
  GradeScaleVersionSummaryDto,
  PolicyVersionDto,
  PolicyVersionListItemDto,
  SecondaryTrack,
  SecondaryTrackRequirementDto,
  SetCreditLoadRulesRequest,
  SetGradeScalesRequest,
  SetSecondaryTrackRequirementsRequest,
  UpdateCohortRangeRequest,
  UpdatePolicyVersionRequest,
} from '../types/api/swagger.types';

export const policyService = {
  // ---- Policy Versions (7) ----
  async listPolicies(isActive?: boolean): Promise<PolicyVersionListItemDto[]> {
    const data = await apiClient.get<PolicyVersionListItemDto[] | null>(
      ADMIN_ENDPOINTS.POLICY_VERSIONS,
      isActive !== undefined ? { isActive } : undefined
    );
    return Array.isArray(data) ? data : [];
  },

  async createPolicy(payload: CreatePolicyVersionRequest): Promise<{ data: PolicyVersionDto; message: string }> {
    const env = await apiClient.postEnvelope<PolicyVersionDto>(ADMIN_ENDPOINTS.POLICY_VERSIONS, payload);
    if (!env.data) throw new ApiError(env.message || 'Policy creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Policy version created.' };
  },

  async getPolicyById(id: number): Promise<PolicyVersionDto> {
    const data = await apiClient.get<PolicyVersionDto | null>(ADMIN_ENDPOINTS.POLICY_VERSION_BY_ID(id));
    if (!data) throw new ApiError('Policy version not found.', 404);
    return data;
  },

  async updatePolicy(
    id: number,
    payload: UpdatePolicyVersionRequest
  ): Promise<{ data: PolicyVersionDto; message: string }> {
    const env = await apiClient.putEnvelope<PolicyVersionDto>(
      ADMIN_ENDPOINTS.POLICY_VERSION_BY_ID(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Policy update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Policy version updated.' };
  },

  async getPolicyForCohort(cohortYear: number): Promise<PolicyVersionDto | null> {
    return apiClient.get<PolicyVersionDto | null>(ADMIN_ENDPOINTS.POLICY_VERSION_FOR_COHORT(cohortYear));
  },

  async activatePolicy(id: number): Promise<{ data: PolicyVersionDto; message: string }> {
    const env = await apiClient.postEnvelope<PolicyVersionDto>(ADMIN_ENDPOINTS.POLICY_VERSION_ACTIVATE(id));
    if (!env.data) throw new ApiError(env.message || 'Policy activation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Policy version activated.' };
  },

  async updatePolicyCohortRange(
    id: number,
    payload: UpdateCohortRangeRequest
  ): Promise<{ data: PolicyVersionDto; message: string }> {
    const env = await apiClient.patchEnvelope<PolicyVersionDto>(
      ADMIN_ENDPOINTS.POLICY_VERSION_COHORT_RANGE(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Cohort range update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Policy cohort range updated.' };
  },

  // ---- Credit Load Rules (2) ----
  async getCreditLoadRules(params?: { policyVersionId?: number; onDate?: string }): Promise<CreditLoadRulesDto> {
    const data = await apiClient.get<CreditLoadRulesDto | null>(
      ADMIN_ENDPOINTS.CREDIT_LOAD_RULES,
      params ? { ...params } : undefined
    );
    if (!data) throw new ApiError('Credit load rules not found.', 404);
    return data;
  },

  async updateCreditLoadRules(
    payload: SetCreditLoadRulesRequest
  ): Promise<{ data: CreditLoadRulesDto; message: string }> {
    const env = await apiClient.putEnvelope<CreditLoadRulesDto>(ADMIN_ENDPOINTS.CREDIT_LOAD_RULES, payload);
    if (!env.data) throw new ApiError(env.message || 'Credit load rules update failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Credit load rules published.' };
  },

  // ---- Grade Scale Versions (5) ----
  async listGradeScaleVersions(isActive?: boolean): Promise<GradeScaleVersionSummaryDto[]> {
    const data = await apiClient.get<GradeScaleVersionSummaryDto[] | null>(
      ADMIN_ENDPOINTS.GRADE_SCALE_VERSIONS,
      isActive !== undefined ? { isActive } : undefined
    );
    return Array.isArray(data) ? data : [];
  },

  async createGradeScaleVersion(
    payload: CreateGradeScaleVersionRequest
  ): Promise<{ data: GradeScaleVersionDto; message: string }> {
    const env = await apiClient.postEnvelope<GradeScaleVersionDto>(
      ADMIN_ENDPOINTS.GRADE_SCALE_VERSIONS,
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Grade scale version creation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Grade scale version created.' };
  },

  async getGradeScaleVersionById(id: number): Promise<GradeScaleVersionDto> {
    const data = await apiClient.get<GradeScaleVersionDto | null>(
      ADMIN_ENDPOINTS.GRADE_SCALE_VERSION_BY_ID(id)
    );
    if (!data) throw new ApiError('Grade scale version not found.', 404);
    return data;
  },

  async setGradeScales(
    id: number,
    payload: SetGradeScalesRequest
  ): Promise<{ data: GradeScaleVersionDto; message: string }> {
    const env = await apiClient.putEnvelope<GradeScaleVersionDto>(
      ADMIN_ENDPOINTS.GRADE_SCALE_VERSION_SCALES(id),
      payload
    );
    if (!env.data) throw new ApiError(env.message || 'Failed to update grade scales.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Grade scales updated.' };
  },

  async activateGradeScaleVersion(
    id: number
  ): Promise<{ data: ActivateGradeScaleResponse; message: string }> {
    const env = await apiClient.postEnvelope<ActivateGradeScaleResponse>(
      ADMIN_ENDPOINTS.GRADE_SCALE_VERSION_ACTIVATE(id)
    );
    if (!env.data) throw new ApiError(env.message || 'Activation failed.', 500, env.errors, env);
    return { data: env.data, message: env.message || 'Grade scale version activated.' };
  },

  // ---- Secondary Track Requirements (3) ----
  async listSecondaryTrackRequirements(): Promise<SecondaryTrackRequirementDto[]> {
    const data = await apiClient.get<SecondaryTrackRequirementDto[] | null>(
      ADMIN_ENDPOINTS.SECONDARY_TRACK_REQUIREMENTS
    );
    return Array.isArray(data) ? data : [];
  },

  async getSecondaryTrackRequirement(track: SecondaryTrack): Promise<SecondaryTrackRequirementDto> {
    const data = await apiClient.get<SecondaryTrackRequirementDto | null>(
      ADMIN_ENDPOINTS.SECONDARY_TRACK_REQUIREMENT_BY_TRACK(track)
    );
    if (!data) throw new ApiError('Secondary track requirement not found.', 404);
    return data;
  },

  async setSecondaryTrackRequirements(
    payload: SetSecondaryTrackRequirementsRequest
  ): Promise<{ data: SecondaryTrackRequirementDto[]; message: string }> {
    const env = await apiClient.putEnvelope<SecondaryTrackRequirementDto[]>(
      ADMIN_ENDPOINTS.SECONDARY_TRACK_REQUIREMENTS,
      payload
    );
    return {
      data: Array.isArray(env.data) ? env.data : [],
      message: env.message || 'Secondary track requirements updated.',
    };
  },
};
