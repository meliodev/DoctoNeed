

export const privilleges = {
    "Admin": {
        "tasks": {
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "users": {
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "requests": {
            "queryFilters": [
                { "clause": "where", "value": "", "operation": "==", "filterOrder": 1, "valueSource": "type", "filter": "type" },
                { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "orders": {
            "queryFilters": [
                { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" },
                { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "messages": {
            "queryFilters": [
                { "field": "sentAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" },
                { "valueSource": "currentUser", "operation": "array-contains", "filterOrder": "1", "value": "", "clause": "where", "filter": "subscribers" }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "documents": {
            "queryFilters": [
                { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" },
                { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "teams": {
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "projects": {
            "queryFilters": [
                { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" },
                { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "clients": {
            "queryFilters": [
                {
                    "clause": "where",
                    "operation": "==",
                    "value": "",
                    "filter": "isProspect",
                    "valueSource": "isProspect",
                    "filterOrder": 1
                },
                {
                    "clause": "where",
                    "operation": "==",
                    "value": false,
                    "filter": "deleted",
                    "filterOrder": 2
                },
                {
                    "clause": "orderBy",
                    "field": "createdAt",
                    "sort": "desc",
                    "filterOrder": 3
                }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        }
    },
    "Doctor": {
        "tasks": {
            "queryFilters": [
                { "operation": "array-contains", "value": "tech", "filterOrder": 1, "clause": "where", "filter": "natures" },
                { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "users": {
            "canDelete": false,
            "canRead": true,
            "canCreate": false,
            "canUpdate": false
        },
        "requests": {
            "queryFilters": [
                { "valueSource": "type", "operation": "==", "filterOrder": 1, "value": "", "clause": "where", "filter": "type" },
                { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": false
        },
        "orders": {
            "queryFilters": [
                { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" },
                { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "messages": {
            "queryFilters": [
                { "valueSource": "currentUser", "filterOrder": 1, "operation": "array-contains", "clause": "where", "value": "", "filter": "subscribers" },
                { "sort": "desc", "filterOrder": 2, "field": "sentAt", "clause": "orderBy" }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": false
        },
        "documents": {
            "queryFilters": [
                { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" },
                { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "teams": {
            "canDelete": false,
            "canRead": true,
            "canCreate": false,
            "canUpdate": false
        },
        "clients": {
            "queryFilters": [
                {
                    "clause": "where",
                    "operation": "==",
                    "value": "",
                    "filter": "isProspect",
                    "valueSource": "isProspect",
                    "filterOrder": 1
                },
                {
                    "clause": "where",
                    "operation": "==",
                    "value": false,
                    "filter": "deleted",
                    "filterOrder": 2
                },
                {
                    "clause": "orderBy",
                    "field": "createdAt",
                    "sort": "desc",
                    "filterOrder": 3
                }
            ],
            "canDelete": true,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "projects": {
            "queryFilters": [
                { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" },
                { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        }
    },
    "Patient": {//Tested: 22/09/2021 18:00
        "tasks": {
            "queryFilters": [
                {
                    "valueSource": "currentUser",
                    "operation": "==",
                    "value": "",
                    "clause": "where",
                    "filter": "assignedTo.id",
                    "filterOrder": 1,
                },
                {
                    "operation": "==",
                    "value": false,
                    "clause": "where",
                    "filter": "deleted",
                    "filterOrder": 2,
                }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": true
        },
        "users": {
            "canDelete": false,
            "canRead": true,
            "canCreate": false,
            "canUpdate": false
        },
        "requests": {
            "queryFilters": [
                {//PUT INDEX
                    "clause": "where",
                    "valueSource": "type",
                    "operation": "==",
                    "value": "",
                    "filter": "type",
                    "filterOrder": 1
                },
                {
                    "clause": "where",
                    "valueSource": "currentUser",
                    "operation": "==",
                    "value": "",
                    "filter": "project.techContact.id",
                    "filterOrder": 2
                },
                {
                    "clause": "where",
                    "filter": "deleted",
                    "operation": "==",
                    "value": false,
                    "filterOrder": 3,
                },
                {
                    "clause": "orderBy",
                    "field": "createdAt",
                    "sort": "desc",
                    "filterOrder": 4
                }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": false
        },
        "orders": {
            "canDelete": false,
            "canRead": false,
            "canCreate": false,
            "canUpdate": false
        },
        "messages": {
            "queryFilters": [
                {
                    "clause": "where",
                    "value": "",
                    "operation": "array-contains",
                    "filterOrder": 1,
                    "valueSource": "currentUser",
                    "filter": "subscribers"
                },
                {
                    "field": "sentAt",
                    "sort": "desc",
                    "filterOrder": 2,
                    "clause": "orderBy"
                }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": true,
            "canUpdate": false
        },
        "documents": {
            "queryFilters": [
                {
                    "clause": "where",
                    "value": "",
                    "operation": "==",
                    "filterOrder": 1,
                    "valueSource": "currentUser",
                    "filter": "project.techContact.id"
                },
                {
                    "operation": "==",
                    "value": false,
                    "filterOrder": 2,
                    "clause": "where",
                    "filter": "deleted"
                },
                {
                    "sort": "desc",
                    "filterOrder": 3,
                    "field": "createdAt",
                    "clause": "orderBy"
                }
            ],
            "canDelete": false,
            "canRead": false,
            "canCreate": false,
            "canUpdate": false
        },
        "teams": {
            "canDelete": false,
            "canRead": true,
            "canCreate": false,
            "canUpdate": false
        },
        "projects": {
            "queryFilters": [
                {
                    "valueSource": "currentUser",
                    "filterOrder": 1,
                    "operation": "==",
                    "value": "",
                    "clause": "where",
                    "filter": "techContact.id"
                },
                {
                    "operation": "==",
                    "value": false,
                    "filterOrder": 2,
                    "filter": "deleted",
                    "clause": "where"
                },
                {
                    "sort": "desc",
                    "filterOrder": 3,
                    "field": "createdAt",
                    "clause": "orderBy"
                }
            ],
            "canDelete": false,
            "canRead": true,
            "canCreate": false,
            "canUpdate": true
        },
        "clients": {
            "canDelete": false,
            "canRead": true,
            "canCreate": false,
            "canUpdate": false
        }
    },
}