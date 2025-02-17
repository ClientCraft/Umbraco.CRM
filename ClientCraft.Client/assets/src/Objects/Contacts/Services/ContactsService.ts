// @ts-nocheck
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecuteAndNotify} from '@umbraco-cms/backoffice/resources';

import {AxiosError, AxiosResponse} from "axios";
import {UmbContextConsumerController} from "@umbraco-cms/backoffice/context-api";
import {UMB_NOTIFICATION_CONTEXT} from "@umbraco-cms/backoffice/notification";
import {
    BaseException,
    BaseExceptionConfig,
    IncorrectIntegerValue
} from "../../../Exceptions/BaseException/base.exception.ts";
import {
    ContactModel,
    createContactV2,
    deleteContactV2,
    getContactsV2,
    getContactV2,
    updateContactV2,
    getContactNames
} from "../../../api/laravel-api-client";
import {ContactTableItem} from "../Elements/root-contacts-workspace.element.ts";


export interface IContactsService {
    getContactsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    getContactNames():  Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    getContact(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    updateContact(id: string, contact: ContactModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    createContact(contact: ContactModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    deleteContact(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;
}

export class ContactsService implements IContactsService {

    #host?: UmbControllerHost;
    #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

    constructor(host?: UmbControllerHost) {
        if (!host) return;

        this.#host = host;

        new UmbContextConsumerController(host, UMB_NOTIFICATION_CONTEXT, (_instance) => {
            this.#notificationContext = _instance;
        });
    }

    /**
     * @description Get table response
     * @returns {data: Contacts[], headers: {name: string, }
     * */
    async getContactsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getContactsV2({query: {include: 'companies.photo'}})) : await getContactsV2({query: {include: 'companies.photo'}});
    }

    async getContactNames():  Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, getContactNames()) : await getContactNames();

        if (
            this.#host &&
            response?.data &&
            'name' in response?.data &&
            BaseException.IsAxiosError(response?.data?.name)
        ) {
            this.#notificationContext?.peek('danger', {
                data: {
                    // @ts-ignore
                    message: response.data.response?.data?.message ??
                        // @ts-ignore
                        (response.data.response?.data?.includes(incorrectIntegerValue.getErrorCode()) && typeof response.data.response?.data === 'string' ? incorrectIntegerValue.toString() : 'Something went wrong')
                }
            })
        }
        
        return response?.data?.data ?? [];
    }

    async getContact(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getContactV2({path: {id}})) : await getContactV2({path: {id}});
    }

    async updateContact(id: string, contact: ContactModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        if (contact instanceof FormData) {
            contact.append('_method', 'PUT');
        }
        const response = this.#host ? await tryExecuteAndNotify(this.#host, updateContactV2({path: {id}, body: contact})) : await updateContactV2({path: {id}, body: contact});

        // @ts-ignore
        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Contact updated successfully'
                }
            });
        }
        // // // TODO: notify via toast
        // console.log(result.data);
        if (
            this.#host &&
            response?.data &&
            'name' in response?.data &&
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

    async createContact(contact: ContactModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, createContactV2({body: contact})) : await createContactV2({body: contact});

        if (response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Contact created successfully'
                }
            });
        }
        // // // TODO: notify via toast
        // console.log(result.data);
        if (
            response?.data &&
            'name' in response?.data &&
            BaseException.IsAxiosError(response?.data?.name)
        ) {
            console.log('teste', response.data);
            const incorrectIntegerValue = IncorrectIntegerValue.create(undefined, BaseExceptionConfig.create().enableDevMode());
            this.#notificationContext?.peek('danger', {
                data: {
                    message: response.data.response?.data?.message ??
                        (response.data.response?.data?.includes(incorrectIntegerValue.getErrorCode()) && typeof response.data.response?.data === 'string' ? incorrectIntegerValue.toString() : 'Something went wrong')
                }
            })
        }
        // Possible errors :) 
        // Add here more error messages that alredy happened on this call. This way we can document all the possible scenarios
        // I'm missing the General Error 1366 IncorrectIntegerValue
        //{"data":{"message":"The email field must be a valid email address.","errors":{"email":["The email field must be a valid email address."]}},"status":422,"statusText":"Unprocessable Content","headers":{"cache-control":"no-cache, private","content-type":"application/json"},"config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded"},"baseURL":"","body":{},"url":"http://foo.localhost:8000/contacts","method":"post","data":{}},"request":{}}
        return response;
    }

    async deleteContact(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, deleteContactV2({path: {id}}), {}) : await deleteContactV2({path: {id}});
        if (response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: response?.data?.data?.message ?? ''
                }
            });
        }

        return response;
    }

    /////////////
    // Transforms
    /////////////

    toTableItems(data: ContactModel[]): ContactTableItem[] {
        return data.flatMap(item => {
            if (!item.id) {
                return [];
            }

            return this.toTableItem(item);
        })
    }

    toTableItem(data: ContactModel): ContactTableItem {
        return {
           ...data
        } as ContactTableItem;
    }

}