import { Dashboard } from "../app/dashboard/Dashboard";
import { PaymentsManager } from "../app/payment/PaymentsManager";
import { Parents } from "../app/parents/Parents";
import { SchoolsManager } from "../app/schools/SchoolsManager";
import { Students } from "../app/students/Strudents";
import { Teachers } from "../app/teachers/Teachers";
import { PlatformsManager } from "../app/manage-plataform/PlatformsManager";
import PlansPage from "../app/plans/page";
import LogsPage from "../app/logs/page";
import BillingPage from "../app/billing/page";
import { LeadsPage } from "../app/leads/LeadsPage";
import { TicketsPage } from "../app/tickets/TicketsPage";
import { SettingsPage } from "../app/settings/SettingsPage";

export const privateRoutes = [
    { path: "/dashboard", element: (
        <Dashboard />
    ) },
    { path: "/leads", element: (
        <LeadsPage />
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

    { path: "/plans", element: (
        <PlansPage />
    ) },

    { path: "/logs", element: (
        <LogsPage />
    ) },
    { path: "/billing", element: (
        <BillingPage />
    ) },
    { path: "/tickets", element: (
        <TicketsPage />
    ) },
    { path: "/settings", element: (
        <SettingsPage />
    ) },
];
