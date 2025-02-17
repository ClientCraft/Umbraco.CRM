import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbRoutableWorkspaceContext, UmbWorkspaceRouteManager} from "@umbraco-cms/backoffice/workspace";
import {CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN} from "./object-leads-workspace.context-token.ts";
import {CLIENTCRAFT_CREATE_LEADS_WORKSPACE_PATH_PATTERN} from "../paths.ts";
import {LeadsService} from "../Services/LeadsService.ts";
import { IRoutingInfo } from "@umbraco-cms/backoffice/external/router-slot";
import {ContactsService} from "../../Contacts/Services/ContactsService.ts";
import {AccountsService} from "../../Accounts/Services/AccountsService.ts";
import {DealsService} from "../../Deals/Services/DealsService.ts";

class UmbObjectLeadsWorkspaceContext extends UmbControllerBase implements UmbRoutableWorkspaceContext {
    // #repository: TimeManagementRespository;
    public readonly workspaceAlias = 'ClientCraft.workspace.leads';
    readonly routes = new UmbWorkspaceRouteManager(this);
    public readonly service: {leads: LeadsService, contacts: ContactsService, accounts: AccountsService, deals: DealsService};
    public currentRoute?: IRoutingInfo['match'];
    constructor(host: UmbControllerHost) {
        super(host);
        // TODO: 
        this.service = {
            leads: new LeadsService(host),
            contacts: new ContactsService(host),
            accounts: new AccountsService(host),
            deals: new DealsService(host)
        }
  
        this.provideContext(CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN, this);
        // this.#repository = new TimeManagementRespository(this);
        this.routes.setRoutes([
            {
                path: "/",
                component: () => import("../Pages/root-leads-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP ROOT', CLIENTCRAFT_CREATE_LEADS_WORKSPACE_PATH_PATTERN.generateAbsolute({
                        sectionName: 'client-craft',
                        entityType: 'leads',
                    }));
                    this.currentRoute = info.match;
                },
            },
            {
                path: 'view/:id',
                component: () => import("../Pages/view-leads-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP VIEW', _component, info)
                    this.currentRoute = info.match;
                },
            },
            {
                path: 'edit/:id',
                component: () => import("../Pages/create-leads-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP EDIT');
                    this.currentRoute = info.match;
                },
            },
            {
                path: '/create',
                component: () => import("../Pages/create-leads-workspace.element.ts"),
                setup: (_component, info) => {
                    console.log('SETTING UP CREATE')
                    this.currentRoute = info.match;
                },
            },
        ]);
    }

    getEntityType(): string {
        return 'leads'
    }
}

export default UmbObjectLeadsWorkspaceContext;