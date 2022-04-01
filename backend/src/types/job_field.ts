// TODO: include in /entity/job.ts or extract as is?

export type JobMode = "onsite" | "hybrid" | "remote";

export type StudentDemographic = "penultimate" | "final_year" | "all";

export type JobType = "intern" | "grad";

// TODO: check if covers all and remove redundant types
export type WorkingRights = "aus_ctz" | "aus_perm_res" | "aus_stud_visa" | "aus_temp_grad_visa" | "nz_ctz_and_perm_res" | "no_wr" | "all"