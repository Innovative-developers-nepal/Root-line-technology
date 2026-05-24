export * from "./auth.schema";
export * from "./user.schema";
export * from "./contact.schema";
export * from "./blog.schema";
export * from "./caseStudy.schema";

// New resources expose conflicting names (idParamContract, slugParamContract).
// Import them directly from the per-resource schema file instead of via this barrel:
//   import { createServiceContract } from "../schemas/service.schema"
