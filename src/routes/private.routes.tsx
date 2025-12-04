import { Dashboard } from "../app/dashboard/Dashboard";
import { PaymentsManager } from "../app/payment/PaymentsManager";
import { Parents } from "../app/parents/Parents";
import { SchoolsManager } from "../app/schools/SchoolsManager";
import { Students } from "../app/students/Strudents";
import { Teachers } from "../app/teachers/Teachers";
import { PlatformsManager } from "../app/manage-plataform/PlatformsManager";

export const privateRoutes = [
    { path: "/dashboard", element: (
        <Dashboard />
    ) },
    
    { path: "/payments", element: (
        <PaymentsManager />
    ) },
    { path: "/schools", element: (
        <SchoolsManager />
    ) },

    { path: "/students", element: (
        <Students />
    ) },

    { path: "/teachers", element: (
        <Teachers />
    ) },

    { path: "/parents", element: (
        <Parents />
    ) },

    { path: "/platforms", element: (
        <PlatformsManager />
    ) },
];