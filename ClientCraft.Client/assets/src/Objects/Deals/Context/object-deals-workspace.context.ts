import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbRoutableWorkspaceContext, UmbWorkspaceRouteManager} from "@umbraco-cms/backoffice/workspace";
import {CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN} from "./object-deals-workspace.context-token.ts";
import {DealsService} from "../Services/DealsService.ts";
import { IRoutingInfo } from "@umbraco-cms/backoffice/external/router-slot";
import {CLIENTCRAFT_CREATE_DEALS_WORKSPACE_PATH_PATTERN} from "../paths.ts";

class UmbObjectDealsWorkspaceContext extends UmbControllerBase implements UmbRoutableWorkspaceContext {
    // #repository: TimeManagementRespository;
    public readonly workspaceAlias = 'ClientCraft.workspace.deals';
    readonly routes = new UmbWorkspaceRouteManager(this);
    public readonly service;
    public currentRoute?: IRoutingInfo['match'];
    constructor(host: UmbControllerHost) {
        super(host);
        this.service = new DealsService(host);
        this.provideContext(CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN, this);
        // this.#repository = new TimeManagementRespository(this);
        this.routes.setRoutes([
            {
                path: "/",
                component: () => import("../Elements/root-deals-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP ROOT', CLIENTCRAFT_CREATE_DEALS_WORKSPACE_PATH_PATTERN.generateAbsolute({
                        sectionName: 'client-craft',
                        entityType: 'deals',
                    }));
                    this.currentRoute = info.match;
                },
            },
            {
                path: 'view/:id',
                component: () => import("../Elements/view-deals-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP VIEW', _component, info)
                    this.currentRoute = info.match;
                },
            },
            {
                path: 'edit/:id',
                component: () => import("../Elements/create-deals-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP EDIT');
                    this.currentRoute = info.match;
                },
            },
            {
                path: '/create',
                component: () => import("../Elements/create-deals-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP CREATE')
                    this.currentRoute = info.match;
                },
            },
        ]);
    }

    getEntityType(): string {
        return 'deals'
    }
}

export default UmbObjectDealsWorkspaceContext;