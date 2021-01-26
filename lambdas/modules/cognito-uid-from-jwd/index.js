const jwtDecode = require('jwt-decode');

exports.getUid = function(eventData) {
    var userId = null;

    if(eventData.headers == undefined) {
        // Mocking the Authorization header for testing with lambda tests
        const fakeToken = 'eyJraWQiOiJyVHE2cVdYMGZXQWtIVFgyVGZwY3F1RVlaOXlpeFdxUFBCekp0clUrcGM4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkMjg2Mjg5Yi04MmJlLTRiNTMtOTViNy02NTRhYzg2YzdhMTUiLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfSkt5UXlIYlhsX0dvb2dsZSJdLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjExNTg2OTI2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9KS3lReUhiWGwiLCJleHAiOjE2MTE1OTA1MjYsImlhdCI6MTYxMTU4NjkyNiwidmVyc2lvbiI6MiwianRpIjoiNzFlODNmMjEtYjhjNy00ZmY2LThjN2QtMTczMjFmZTBhN2E4IiwiY2xpZW50X2lkIjoiN3RwZ3J0bmQxcjJuc2VqOW50MGdnOGNqMWEiLCJ1c2VybmFtZSI6Imdvb2dsZV8xMDA2MDcwODAwOTAwODU1NzAyMzQifQ.ENC7vABmdEvolyYLtvrNCggCp0J2b1KMCIm6166rI1rhp-wDbG_kjL-0-DVpJcspj0imKYCVmYU1lki9VSaN3nIdkpFrkxdsnZUV34je8h8z70IdTfl8qE2NXUMwc97ECbH8umvQIEuHjApCzLL8SJqRiKecR-q5DA2LAnz96MPAgsYBBNmsnC_sGg9rr_oqunJOhAQaI_KHAKwPE27yZmyqnxgKfKob-jbrwUlHsjDuj-oP0_fBYtszpY4aa2Z8B_pkXVPTX6Z25kmpoPEpoaGohXIZBDU0ZQwl0crDMo9v4GvX01Gcl1t_jcOCmzkU7kpGLmHZsPkldU1MJjNU5Q';
        eventData = Object.assign({...eventData}, {
        headers: {
            authorization: 'Bearer ' + fakeToken
        }});
    }

    const token = eventData.headers.authorization.replace("Bearer ", "");
    const decodedToken = jwtDecode(token);
    userId = decodedToken.sub;

    return userId;
}
