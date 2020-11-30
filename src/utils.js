'use strict'

/**
 * Class that manages AWS COGNITO AUTH API so we can avoid using the aws cancer sdk for login!
 *
 * @author <cf19daniel.dominguez@iesjoandaustria.org>
 */
class Oauth2AWSAPI {
    constructor(axiosInstance, baseApi, client, secret){
        this.axios = axiosInstance;
        this.baseApi = baseApi;
        this.client = client;
        this.secret = secret;
    }

    authorizationEndPoint(redirectUri){
        const params = {
            response_type: 'code',
            client_id: this.client,
            redirect_uri: redirectUri,
            state: 'asdf', // security
            identity_provider: 'Google'
        };

        const uri = this.baseApi + 'oauth2/authorize';
        return [uri, params];
    }

    authTokenEndPoint(codeGrant){
        /*
        Content-Type
        Must always be 'application/x-www-form-urlencoded'.
        */
        const headers = {
            'Authorization': 'Basic '+ btoa(this.client + ":" + this.secret),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        

        const params = {
            'grant_type': 'authorization_code',
            'code': codeGrant,
            'redirect_uri' : process.env.REACT_APP_COGNITO_AUTH_REDIRECT_URI,
            'client_id': this.client
        };
        const uri = this.baseApi + 'oauth2/token';
        return [uri, params, headers];
    }

    performRequest(data, method) {
        console.log("BLARG");
        console.log(data[1]);

        let obj = {
            method: method,
            url: data[0],
            data: data[1],
            transformRequest: (data, headers) => {
                let str = [];
                for( let x in data) {
                    str.push(x + '=' + encodeURIComponent(data[x]));
                }
                return str.join("&");
            }

        };

        if(data[2] !== undefined) {
            obj.headers = data[2];
        }

        console.log(obj.headers);

        this.axios(
            obj
        );
    }

    toURI(arr){
        const params = [];
        let pair;
        for(let x in arr[1]) {
            pair = x + '=' + arr[1][x];
            params.push(pair);
        }

        return arr[0] + '?' + params.join("&");
    }
}

export { Oauth2AWSAPI };
