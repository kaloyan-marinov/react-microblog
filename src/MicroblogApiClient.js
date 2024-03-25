const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default class MicroblogApiClient {
  /*
  This encapsulates the logic for issuing HTTP requests to the backend (web) API.
  */

  constructor() {
    this.base_url = BASE_API_URL + "/api";
  }

  async request(options) {
    /*
    Support transparent token refreshes as follows:

    - Send the request
    - If the response is not 401
    - Return response to caller
    - Else
    - Refresh access token
    - Send original request again with new access token
    - Return response to caller
    */

    let response = await this.requestInternal(options);

    // If
    // the original request came back with a 401 status code
    // _and_
    // the URL is not the one for the refresh token endpoint already
    // (with the second check being useful in order to avoid a possible endless loop
    // in case requests to the refresh-token endpoint also fail with a 401 status code):
    if (response.status === 401 && options.url !== "/tokens") {
      const refreshResponse = await this.put("/tokens", {
        access_token: localStorage.getItem("accessToken"),
      });

      if (refreshResponse.ok) {
        localStorage.setItem("accessToken", refreshResponse.body.access_token);
        response = await this.requestInternal(options);
      }
    }

    return response;
  }

  async requestInternal(options) {
    /*
    Assume that, if the [HTTP] client doesn't have an access token,
    then a different `Authorization` header will be included
    in the `options` object passed by the caller,
    which overrides the `Authorization` header defined here.
    */

    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          ...options.headers,
        },
        // The following causes the cookies,
        // which the backend API set when the user first authenticated,
        // to be sent.
        credentials: options.url === "/tokens" ? "include" : "omit",
        body: options.body ? JSON.stringify(options.body) : null,
      });
    } catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => {
          // The body in this error response is formatted in the same style as
          // actual API errors returned by the Microblog API service.
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error.toString(),
          };
        },
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  async get(url, query, options) {
    return this.request({
      method: "GET",
      url,
      query,
      ...options,
    });
  }

  async post(url, body, options) {
    return this.request({
      method: "POST",
      url,
      body,
      ...options,
    });
  }

  async put(url, body, options) {
    return this.request({
      method: "PUT",
      url,
      body,
      ...options,
    });
  }

  async delete(url, options) {
    return this.request({
      method: "DELETE",
      url,
      ...options,
    });
  }

  async login(username, password) {
    /*
    Handle all _three_ possible cases,
    which may arise as a consequence of issuing a POST request to "/api/tokens".

    The two most obvious ones are
    an authentication success (in which case this method returns "ok")
    and
    an failure (in which case this method returns "fail").
    
    A third less likely case is
    when the authentication request fails not because of invalid credentials
    but because of an unexpected issue (in which case this method returns "error").
    */

    const base64EncodingOfCredentials = btoa(username + ":" + password);
    const response = await this.post("/tokens", null, {
      headers: {
        Authorization: "Basic " + base64EncodingOfCredentials,
      },
    });

    if (!response.ok) {
      return response.status === 401 ? "fail" : "error";
    }

    /*
    Storing the token in local storage
    makes it possible for the application to "remember" the authenticated user
      when the user refreshes the browser page,
      when the site is opened in multiple tabs,
      and when the browser is closed and reopened,
    which are behaviors that most users expect from a web application.
    
    However, you should keep in mind that
    storing sensitive information in local storage presents a risk
    if your application is vulnerable to cross-site scripting (XSS) attacks.

    An XSS attack involves the attacker figuring out a way
    to insert malicious JavaScript into an application running on the user's browser.
    There are two basic ways in which this can happen:
      
      (1) The attacker
          finds a way to break into the server
          that hosts the application's JavaScript files
          and
          makes modifications to them
          so that hacked versions with malicious code are served to clients.
      
      (2) The attacker tricks the application running in the browser
          into rendering a `<script>` tag with malicious JavaScript code.

      With regard to the attack vector in (1):
      if you host your React application yourself,
      then you must use standard server hardening techniques such as
        passwordless logins,
        use of a firewall,
        closing any unnecessary network ports,
        etc.
      
      With regard to the attack vector in (2):
      React provides decent protection against that attack vector,
      as long as you render all the content in your application through JSX.
      Protection against XSS attacks in React
      consists in applying escaping to all the text
      that is included in JSX contents returned by components.
      This escaping is always applied,
      there is no need to enable this protection.

      To keep your application well protected,
      it is extremely important to avoid the temptation
      to bypass JSX and render contents to the page directly through DOM APIs,
      as this would not have any protection against XSS attacks.

      When all these security concerns are addressed,
      the risk of a React application being the victim of an XSS attack
      is extremely low.

      ---

      Even though it would be unlikely for an access token to be compromised,
      it is considered a good practice to use short expirations on these tokens,
      so that if an attacker manages to steal a token by some unknown attack method,
      the damage that can be done with it is limited.
      
      The access tokens issued by the backend API
      can only be renewed
      with a refresh token that is stored in a secure cookie,
      inaccessible from the browser's JavaScript environment.
    */
    localStorage.setItem("accessToken", response.body.access_token);
    return "ok";
  }

  async logout() {
    /*
    Log the user out (of both the backend application and the frontend application.)
    */

    // Issue an HTTP request to the backend API's token-revocation endpoint.
    await this.delete("/tokens");

    // Make the frontend application completely forget about the revoked token.
    localStorage.removeItem("accessToken");
  }

  isAuthenticated() {
    /*
    Check if there is an authenticated user.
    */
    return localStorage.getItem("accessToken") !== null;
  }
}
