export const PERMISSIONS = {
    USERS: {
        resource: "users",
        actions: {
            READ:   "read",
            WRITE:  "write",
            DELETE: "delete",
        },
    },
    REPORTS: {
        resource: "reports",
        actions: {
            READ:   "read",
            CREATE: "create",
            EXPORT: "export",
        },
    },
    ANALYTICS: {
        resource: "analytics",
        actions: {
            READ:     "read",
            ADVANCED: "advanced",
        },
    },
    CONTACTS: {
        resource: "contacts",
        actions: {
            READ: "read",
            WRITE: "write",
        },
    },
    BLOG: {
        resource: "blog",
        actions: {
            READ:   "read",
            WRITE:  "write",
            DELETE: "delete",
        },
    },
    CASE_STUDIES: {
        resource: "case_studies",
        actions: {
            READ:   "read",
            WRITE:  "write",
            DELETE: "delete",
        },
    },
    SERVICES: {
        resource: "services",
        actions: {
            READ:    "read",
            WRITE:   "write",
            DELETE:  "delete",
            PUBLISH: "publish",
        },
    },
    TEAM: {
        resource: "team",
        actions: {
            READ:   "read",
            WRITE:  "write",
            DELETE: "delete",
        },
    },
    JOBS: {
        resource: "jobs",
        actions: {
            READ:    "read",
            WRITE:   "write",
            DELETE:  "delete",
            PUBLISH: "publish",
        },
    },
    APPLICATIONS: {
        resource: "applications",
        actions: {
            READ:   "read",
            WRITE:  "write",
            DELETE: "delete",
        },
    },
} as const;

export type PermissionGroup = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type PermissionAction = PermissionGroup["actions"][keyof PermissionGroup["actions"]];
