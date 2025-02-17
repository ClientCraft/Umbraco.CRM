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
    DealModel,
    createDealV2,
    deleteDealV2,
    getDealsV2,
    getDealV2,
    updateDealV2,
    getDealNames
} from "../../../api/laravel-api-client";
import {DealTableItem} from "../Elements/root-deals-workspace.element.ts";


export interface IDealsService {
    getDealsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    getDealNames():  Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    getDeal(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    updateDeal(id: string, deal: DealModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    createDeal(deal: DealModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    deleteDeal(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;
}

export class DealsService implements IDealsService {

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
     * @returns {data: Deals[], headers: {name: string, }
     * */
    async getDealsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getDealsV2()) : await getDealsV2();
    }

    async getDealNames():  Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, getDealNames()) : await getDealNames();

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

    async getDeal(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getDealV2({path: {id}})) : await getDealV2({path: {id}});
    }

    async updateDeal(id: string, deal: DealModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        if (deal instanceof FormData) {
            deal.append('_method', 'PUT');
        }
        const response = this.#host ? await tryExecuteAndNotify(this.#host, updateDealV2({path: {id}, body: deal})) : await updateDealV2({path: {id}, body: deal});

        // @ts-ignore
        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Deal updated successfully'
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

    async createDeal(deal: DealModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, createDealV2({body: deal})) : await createDealV2({body: deal});

        if (response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Deal created successfully'
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
        //{"data":{"message":"The email field must be a valid email address.","errors":{"email":["The email field must be a valid email address."]}},"status":422,"statusText":"Unprocessable Content","headers":{"cache-control":"no-cache, private","content-type":"application/json"},"config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded"},"baseURL":"","body":{},"url":"http://foo.localhost:8000/deals","method":"post","data":{}},"request":{}}
        return response;
    }

    async deleteDeal(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, deleteDealV2({path: {id}}), {}) : await deleteDealV2({path: {id}});
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

    toTableItems(data: DealModel[]): DealTableItem[] {
        return data.flatMap(item => {
            if (!item.id) {
                return [];
            }

            return this.toTableItem(item);
        })
    }

    toTableItem(data: DealModel): DealTableItem {
        return {
           ...data
        } as DealTableItem;
    }

}