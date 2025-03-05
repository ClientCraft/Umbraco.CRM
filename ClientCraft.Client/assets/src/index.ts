import { UmbEntryPointOnInit } from '@umbraco-cms/backoffice/extension-api';
import './Objects/index.ts';
// load up the manifests here.
import { manifests as dashboardManifests } from './Objects/Common/Elements/manifest.ts';
import { objectsManifests } from "./Objects/manifest.ts";
import { client as laravelApiClient } from "./api/laravel-api-client";
import { defineComponents, IgcCircularProgressComponent, IgcDropdownComponent, IgcStepperComponent, IgcIconComponent } from "igniteui-webcomponents";
import 'igniteui-webcomponents/themes/light/bootstrap.css';
import '@webcomponents/custom-elements/custom-elements.min';
import '@webcomponents/custom-elements/src/native-shim.js';
import './Components/index.ts';

const manifests: Array<UmbExtensionManifest> = [
    ...dashboardManifests,
    ...objectsManifests
];

console.log(manifests)
 
export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
    // Create logic to use a different URL in production. Maybe retrieve it from the umbraco backoffice to allow using other backend clients.
    laravelApiClient.setConfig({
        baseURL: "http://foo.localhost:8000",
    });
    defineComponents(IgcDropdownComponent, IgcStepperComponent, IgcIconComponent, IgcCircularProgressComponent);

    // register them here. 
    extensionRegistry.registerMany(manifests);
};