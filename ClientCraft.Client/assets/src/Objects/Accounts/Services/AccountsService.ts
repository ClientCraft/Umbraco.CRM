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
    AccountModel,
    createAccountV2, 
    deleteAccountV2,
    getAccountsV2,
    getAccountV2,
    updateAccountV2,
    getAccountNames
} from "../../../api/laravel-api-client";
import {AccountTableItem} from "../Elements/root-accounts-workspace.element.ts";

const accountStatusColorsMap:{ [key in Exclude<AccountModel["status"], undefined>]: AccountTableItem['status']['color'] } = {
    customer: "default",
    churn: "danger",
}
export interface IAccountsService {
    getAccountsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    getAccountNames():  Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;
    
    getAccount(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    updateAccount(id: string, account: AccountModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    createAccount(account: AccountModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;

    deleteAccount(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)>;
}

export class AccountsService implements IAccountsService {

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
     * @returns {data: Accounts[], headers: {name: string, }
     * */
    async getAccountsTable(): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getAccountsV2({query: {include: 'photo'}})) : await getAccountsV2({query: {include: 'photo'}});
    }
    
    async getAccountNames():  Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        console.log(">>>>>>>>>>>>>>>>>>> TO AQUI");
        const response = this.#host ? await tryExecuteAndNotify(this.#host, getAccountNames()) : await getAccountNames();
        console.log(">>>>>>>>>>>>>>>>>>>", response);
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

    async getAccount(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        return this.#host ? await tryExecuteAndNotify(this.#host, getAccountV2({path: {id}})) : await getAccountV2({path: {id}});
    }

    async updateAccount(id: string, account: AccountModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        if (account instanceof FormData) {
            account.append('_method', 'PUT');
        }

        const response = this.#host ? await tryExecuteAndNotify(this.#host, updateAccountV2({path: {id}, body: account})) : await updateAccountV2({path: {id}, body: account});

        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Account updated successfully'
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

    async createAccount(account: AccountModel): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, createAccountV2({body: account})) : await createAccountV2({body: account});

        if (this.#host && response?.data?.data) {
            this.#notificationContext?.peek('positive', {
                data: {
                    message: 'Account created successfully'
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
                    message: response.data.response?.data?.message ??
                        // @ts-ignore
                        (response.data.response?.data?.includes(incorrectIntegerValue.getErrorCode()) && typeof response.data.response?.data === 'string' ? incorrectIntegerValue.toString() : 'Something went wrong')
                }
            })
        }
        // Possible errors :) 
        // Add here more error messages that alredy happened on this call. This way we can document all the possible scenarios
        // I'm missing the General Error 1366 IncorrectIntegerValue
        //{"data":{"message":"The email field must be a valid email address.","errors":{"email":["The email field must be a valid email address."]}},"status":422,"statusText":"Unprocessable Content","headers":{"cache-control":"no-cache, private","content-type":"application/json"},"config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded"},"baseURL":"","body":{},"url":"http://foo.localhost:8000/accounts","method":"post","data":{}},"request":{}}
        return response;
    }

    async deleteAccount(id: string): Promise<(UmbDataSourceResponse<AxiosResponse<unknown> | AxiosError<unknown>>) | (AxiosError<unknown, any> | AxiosResponse<unknown>)> {
        const response = this.#host ? await tryExecuteAndNotify(this.#host, deleteAccountV2({path: {id}}), {}) : await deleteAccountV2({path: {id}});
        if (this.#host && response?.data?.data) {
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

    toTableItems(data: AccountModel[]): AccountTableItem[] {
        return data.flatMap(item => {
            if (!item.id) {
                return [];
            }

            return this.toTableItem(item);
        })
    }

    toTableItem(data: AccountModel): AccountTableItem {
        return {
            ...data,
            status: {
                label: data.status ?? '',
                color: accountStatusColorsMap[data.status ?? 'customer']
            },
          
        } as AccountTableItem;
    }

}