import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-axios',
    input: 'src/api/laravel-api-client/swagger.json',
    output: 'src/api/laravel-api-client',
});