import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecuteAndNotify} from '@umbraco-cms/backoffice/resources';

import {AxiosError, AxiosResponse} from "axios";

import { UmbContextConsumerController } from "@umbraco-cms/backoffice/context-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
    BaseException,
    BaseExceptionConfig,
    IncorrectIntegerValue
} from "../../../Exceptions/BaseException/base.exception.ts";
import {
    createLeadV2, deleteLeadV2, getLeadStatuses,
    getLeadsV2,
    getLeadV2,
    LeadModel,
    updateLeadV2,
    convertLeadV2
} from "../../../api/laravel-api-client";
import { LeadStatuses, LeadTableItem } from "../Pages/root-leads-workspace.element.ts";

// @ts-ignore
const leadStatusColorsMap:{ [key in Exclude<LeadModel["status"], undefined>]: LeadTableItem['status']['color'] } = {
    new: "default",
    contacted: "secondary",
    closed: "danger",
    converted: "positive"
}
export interface ILeadsService {
    getLeadsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    convert(leadToConvert: LeadModel, options: {
        accountToAttach?: number;
        dealToAttach?: number;
        contactToAttach?: number;
        accountToCreate?: string,
        dealToCreate?: string,
        contactToCreate?: string
    }): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>    
    
    getLead(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    updateLead(id: string, lead: LeadModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    createLead(lead: LeadModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    deleteLead(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    getLeadStatuses(): Promise<LeadStatuses[]>;
}

export class LeadsService implements ILeadsService {

    #host?: UmbControllerHost;
    #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
    constructor(host?: UmbControllerHost) {
        if (!host) return;

        this.#host = host;
        
        new UmbContextConsumerController(host, UMB_NOTIFICATION_CONTEXT, (_instance) => {
            this.#notificationContext = _instance;
        });
    }

    getFormData(object: unknown) {
        const formData = new FormData();
        // @ts-ignore
        Object.keys(object).forEach(key => {
            // @ts-ignore
            if (typeof object[key] !== 'object') formData.append(key, object[key])
            // @ts-ignore
            else formData.append(key, JSON.stringify(object[key]))
        })
        return formData;
    }
    
    /**
     * @description Get table response
     * @returns {data: Leads[], headers: {name: string, }
     * */
    async getLeadsTable(showConverted: boolean = false): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getLeadsV2({query: {include: 'status,owners', showConverted: showConverted.toString() as "true" | "false"}})) : await getLeadsV2({query: {include: 'status,owners', showConverted: showConverted.toString() as "true" | "false"}});
    }
    
    async convert(leadToConvert: LeadModel, options: {
        accountToAttach?: number;
        dealToAttach?: number;
        contactToAttach?: number;
        accountToCreate?: string,
        dealToCreate?: string,
        contactToCreate?: string
    }): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        
        const response = this.#host ? await tryExecuteAndNotify(this.#host, convertLeadV2({body: {lead: leadToConvert.id!, ...options}})) : await convertLeadV2({body: {lead: leadToConvert.id!, ...options}});
        // @ts-ignore
        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    // @ts-ignore
                    message: response.data?.data?.message ?? 'Lead converted successfully'
                }
            });
        }
        // // // TODO: notify via toast
        // console.log(result.data);
        if (
            this.#host &&
            response?.data &&
            'name' in response?.data &&
            // @ts-ignore
            BaseException.IsAxiosError(response?.data?.name)
        ) {
            const incorrectIntegerValue = IncorrectIntegerValue.create(undefined, BaseExceptionConfig.create().enableDevMode());
            this.#notificationContext?.peek('danger', {
                data: {
                    // @ts-ignore
                    message: response.data.response?.data?.message ??
                        // @ts-ignore
                        // TODO: make this error good in the future
                        (response.data.response?.data?.includes(incorrectIntegerValue.getErrorCode()) && typeof response.data.response?.data === 'string' ? incorrectIntegerValue.toString() : 'Something went wrong')
                }
            })

        }
        return response;
    }
    
    async getLeadStatuses(): Promise<LeadStatuses[]> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, getLeadStatuses()) : await getLeadStatuses();
        // @ts-ignore
        if (BaseException.IsAxiosError(response?.data?.name)) {
            return [];
        }

        // @ts-ignore
        return response.data?.data;
    }

    async getLead(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getLeadV2({path: {id}, query: {include: 'status,owners,photo'}})) : await getLeadV2({path: {id}, query: {include: 'status,owners,photo'}});
    }

    // TODO: Verificar se essas tipagens das respostas estao corretas
    async updateLead(id: string, lead: LeadModel | FormData): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        if (!(lead instanceof FormData)) {
            lead = this.getFormData(lead);
        }
            
        lead.append('_method', 'PUT');
        console.log(typeof lead);
        const response = this.#host ? await tryExecuteAndNotify(this.#host, updateLeadV2({path: {id}, body: lead as LeadModel})) : await updateLeadV2({path: {id}, body: lead as LeadModel});

        // @ts-ignore
        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Lead updated successfully'
                }
            });
        }
        // // // TODO: notify via toast
        // console.log(result.data);
        if (
            this.#host &&
            response?.data &&
            'name' in response?.data &&
            // @ts-ignore
            BaseException.IsAxiosError(response?.data?.name)
        ) {
            console.log('teste', response.data);
            const incorrectIntegerValue = IncorrectIntegerValue.create(undefined, BaseExceptionConfig.create().enableDevMode());
            this.#notificationContext?.peek('danger', {
                data: {
                    // @ts-ignore
                    message: response.data.response?.data?.message ??
                    // @ts-ignore
                        (response.data.response?.data?.includes(incorrectIntegerValue.getErrorCode()) && typeof response.data.response?.data === 'string' ? incorrectIntegerValue.toString() : 'Something went wrong')
                }
            })
            
        }
        return response;
    }

    async createLead(lead: LeadModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, createLeadV2({body: lead})) : await createLeadV2({body: lead});
        // @ts-ignore
        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Lead created successfully'
                }
            });
        }
        // // // TODO: notify via toast
        // console.log(result.data);
        if (
            this.#host &&
            response?.data &&
            'name' in response?.data &&
            // @ts-ignore
            BaseException.IsAxiosError(response?.data?.name)
        ) {
            console.log('teste', response.data);
            const incorrectIntegerValue = IncorrectIntegerValue.create(undefined, BaseExceptionConfig.create().enableDevMode());
            this.#notificationContext?.peek('danger', {
                data: {
                    // @ts-ignore
                    message: response.data.response?.data?.message ??
                        // @ts-ignore
                        (response.data.response?.data?.includes(incorrectIntegerValue.getErrorCode()) && typeof response.data.response?.data === 'string' ? incorrectIntegerValue.toString() : 'Something went wrong')
                }
            })
        }
        // Possible errors :) 
        // Add here more error messages that alredy happened on this call. This way we can document all the possible scenarios
        // I'm missing the General Error 1366 IncorrectIntegerValue
        //{"data":{"message":"The email field must be a valid email address.","errors":{"email":["The email field must be a valid email address."]}},"status":422,"statusText":"Unprocessable Content","headers":{"cache-control":"no-cache, private","content-type":"application/json"},"config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded"},"baseURL":"","body":{},"url":"http://foo.localhost:8000/leads","method":"post","data":{}},"request":{}}
        return response;
    }

    async deleteLead(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, deleteLeadV2({path: {id}}), {}) : await deleteLeadV2({path: {id}});
        // @ts-ignore
        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    // @ts-ignore
                    message: response?.data?.data?.message ?? ''
                }
            });
        }
        
        return response;
    }
    
    /////////////
    // Transforms
    /////////////

    toTableItems(data: LeadModel[]): LeadTableItem[] {
        return data.flatMap(item => {
            if (!item.id) {
                return [];
            }
            
            return this.toTableItem(item);
        })
    }
    
    toTableItem(data: LeadModel): LeadTableItem {
        return {
            ...data,
        } as LeadTableItem;
    }
}