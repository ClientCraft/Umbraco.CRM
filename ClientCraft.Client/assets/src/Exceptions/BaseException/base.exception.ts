// @ts-nocheck
// BaseExceptionConfig.ts
export class BaseExceptionConfig {
    _devMode: boolean;

    constructor(devMode?: boolean) {
        this._devMode = devMode ?? false;
    }

    static create(): BaseExceptionConfig {
        return new BaseExceptionConfig();
    }

    enableDevMode() {
        this._devMode = true;
        return this;
    }

    isDevModeEnabled(): boolean {
        return this._devMode;
    }
}


export class BaseException extends Error {
    _config?: BaseExceptionConfig;
    _errorCode?: string;

    constructor(message?: string, config?: BaseExceptionConfig, errorCode?: string) {
        super(message); // Call the parent class constructor with the error message
        this.name = this.constructor.name; // Set the name of the error to the class name
        Object.setPrototypeOf(this, new.target.prototype); // Correct the prototype chain

        this._config = config;
        this._errorCode = errorCode;

        // If devMode is enabled, include detailed debug info
        // Add a generic error message with the error code for production
        this.message = `Something went wrong, please contact support. ERROR CODE: ${this._errorCode || 'UNKNOWN'}`;
        
    }
    
    static create(message?: string, config?: BaseExceptionConfig, errorCode?: string): BaseException {
        console.log(config);
        return new this(message, config, errorCode);
    }
    
    // Optionally override toString to control how the error is displayed
    toString(): string {
        return this.message;
    }
    
    getErrorCode(): string | undefined {
        return this._errorCode;
    }
    
    static IsAxiosError(errorName: string): boolean {
        return errorName === 'AxiosError'
    };
    
    static IsLaravelError(error: unknown): error is LaravelValidationError {
        return typeof error === 'object' && error !== null && 'message' in error && 'errors' in error; 
    }
}

export class LaravelValidationError extends BaseException {
    private constructor(error: LaravelValidationError) {
        super(error.message);
    }
    
    fromError(error: unknown): LaravelValidationError | null  {
        if (BaseException.IsLaravelError(error)) {
            return this(error);
        }
        return null
    }
}

// IncorrectIntegerValue.ts
export class IncorrectIntegerValue extends BaseException {
    constructor(message: string, config?: BaseExceptionConfig) {
        super(message, config, '1366'); // Pass the error code to BaseException
        // You can add any additional logic or properties specific to IncorrectIntegerValue
    }
}

export class UnprocessableContent extends BaseException {
    _errorCode: string = '1367';
    constructor(errorOrMessage: string | LaravelValidationError, config?: BaseExceptionConfig) {
        if (BaseException.IsLaravelError(errorOrMessage)) {
          super(errorOrMessage as string, config, this._errorCode);  
        }
        super(errorOrMessage, config, '1367'); // Pass the error code to BaseException
        // You can add any additional logic or properties specific to IncorrectIntegerValue
    }
}