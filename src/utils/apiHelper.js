export function callApi(url, onSuccess, onError) {
    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (responseJson) {
        if (responseJson.status === "ok") {
            onSuccess({response: responseJson, error: null});
            return;
        }
        onError({response: null, error: responseJson.message});
    }).catch(function (exception) {
        onError({response: null, error: exception});
    });
}