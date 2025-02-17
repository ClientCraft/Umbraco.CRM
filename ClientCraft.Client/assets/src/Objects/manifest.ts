import { leadsManifests } from './Leads';
import { contactsManifests } from "./Contacts";
import {accountsManifests} from "./Accounts";
import {dealsManifests} from "./Deals";
import { ManifestSection, ManifestSectionSidebarApp } from '@umbraco-cms/backoffice/section';
import { ManifestMenu } from '@umbraco-cms/backoffice/menu';
import { ManifestDashboard } from '@umbraco-cms/backoffice/dashboard';
import { ManifestLocalization } from '@umbraco-cms/backoffice/localization';

const sections: Array<ManifestSection> = [
    {
        type: 'section',
        alias: 'ClientCraft.section',
        name: 'crm section',
        weight: 10,
        meta: {
            label: 'CRM',
            pathname: 'client-craft'
        }
    }
];

const sidebars: ManifestSectionSidebarApp[] = [{
    type: 'sectionSidebarApp',
    kind: 'menuWithEntityActions',
    alias: 'time.sidebar.app',
    name: 'Sidebar app',
    meta: {
        label: "CRM",
        menu: "ClientCraft.menu"

    },
    conditions: [
        {
            alias: "Umb.Condition.SectionAlias",
            match: "ClientCraft.section"
        }
    ]
}];

const menus: ManifestMenu[] = [{
    type: 'menu',
    alias: 'ClientCraft.menu',
    name: 'time sidebar menu',
    meta: {
        label: 'Menu'
    }
}];

const dashboards: Array<ManifestDashboard> = [
    {
        type: 'dashboard',
        name: 'ClientCraft',
        alias: 'ClientCraft.dashboard',
        elementName: 'clientcraft-dashboard',
        js: () => import('./Common/Elements/dashboard.element.js'),
        weight: -10,
        meta: {
            label: 'ClientCraft',
            pathname: 'home'
        },
        conditions: [
            {
                alias: 'Umb.Condition.SectionAlias',
                match: 'ClientCraft.section'
            }
        ]
    }
];

const localizations: Array<ManifestLocalization> = [
    {
        type: 'localization',
        alias: 'ClientCraft.lang.engb',
        name: 'English (US)',
        weight: 0,
        meta: {
            culture: 'en-us'
        },
        js: () => import('../translations/en-us.ts')
    },
];

export const objectsManifests = [
    ...localizations,
    ...menus,
    ...sections,
    ...sidebars,
    ...dashboards,
    ...leadsManifests,
    ...contactsManifests,
    ...accountsManifests,
    ...dealsManifests
]