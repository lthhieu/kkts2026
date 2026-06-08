import queryString from 'query-string'
// import slugify from 'slugify'

export const sendRequest = async <T>(props: IRequest) => {
    let {
        url,
        method,
        useCredentials = false,
        body,
        headers = {},
        queryParams = {},
        nextOption = {}
    } = props
    const options: any = {
        method: method ?? 'GET',
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";
    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};
export const sendRequestFile = async <T>(props: IRequest) => {
    let {
        url,
        method,
        useCredentials = false,
        body,
        headers = {},
        queryParams = {},
        nextOption = {}
    } = props
    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";
    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};
export const sendRequestBlob = async (props: IRequest) => {
    let {
        url,
        method,
        useCredentials = false,
        body,
        headers = {},
        queryParams = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method ?? 'GET',
        headers: new Headers({ ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };

    if (useCredentials) options.credentials = 'include';

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(async (res) => {
        if (res.ok) {
            return await res.blob();
        } else {
            const json = await res.json();

            throw new Error(
                json?.message ??
                json?.error ??
                'Download failed'
            );
        }
    });
};