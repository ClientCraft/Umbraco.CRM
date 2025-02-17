import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbRoutableWorkspaceContext, UmbWorkspaceRouteManager} from "@umbraco-cms/backoffice/workspace";
import {CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN} from "./object-contacts-workspace.context-token.ts";
import {ContactsService} from "../Services/ContactsService.ts";
import { IRoutingInfo } from "@umbraco-cms/backoffice/external/router-slot";
import {CLIENTCRAFT_CREATE_CONTACTS_WORKSPACE_PATH_PATTERN} from "../paths.ts";

class UmbObjectContactsWorkspaceContext extends UmbControllerBase implements UmbRoutableWorkspaceContext {
    // #repository: TimeManagementRespository;
    public readonly workspaceAlias = 'ClientCraft.workspace.contacts';
    readonly routes = new UmbWorkspaceRouteManager(this);
    public readonly service;
    public currentRoute?: IRoutingInfo['match'];
    constructor(host: UmbControllerHost) {
        super(host);
        this.service = new ContactsService(host);
        this.provideContext(CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN, this);
        // this.#repository = new TimeManagementRespository(this);
        this.routes.setRoutes([
            {
                path: "/",
                component: () => import("../Elements/root-contacts-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP ROOT', CLIENTCRAFT_CREATE_CONTACTS_WORKSPACE_PATH_PATTERN.generateAbsolute({
                        sectionName: 'client-craft',
                        entityType: 'contacts',
                    }));
                    this.currentRoute = info.match;
                },
            },
            {
                path: 'view/:id',
                component: () => import("../Elements/view-contacts-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP VIEW', _component, info)
                    this.currentRoute = info.match;
                },
            },
            {
                path: 'edit/:id',
                component: () => import("../Elements/create-contacts-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP EDIT');
                    this.currentRoute = info.match;
                },
            },
            {
                path: '/create',
                component: () => import("../Elements/create-contacts-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP CREATE')
                    this.currentRoute = info.match;
                },
            },
        ]);
    }

    getEntityType(): string {
        return 'contacts'
    }
}

export default UmbObjectContactsWorkspaceContext;