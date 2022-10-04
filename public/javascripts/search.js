let cancelToken;
document.getElementById('search-user').addEventListener('input', (e) => {
  let value = document.getElementById('search-user').value;
  if (cancelToken) {
    cancelToken.cancel('Operation Cancelled due to new request');
  }
  if (value.length) {
    document.getElementById('search-container').innerHTML =
      '<div class="w-100 text-center mt-3"><div class="spinner-border spinner-border-sm text-secondary" role="status"><span class="sr-only">Loading...</span></div></div>';
  } else {
    document.getElementById('search-container').innerHTML = '';
  }
  cancelToken = axios.CancelToken.source();

  axios
    .get('/explore/search/users', {
      cancelToken: cancelToken.token,
      params: {
        value,
      },
    })
    .then(function (response) {
      document.getElementById('search-container').innerHTML = '';
      if (response.data.users) {
        response.data.users.forEach((user) => {
          let div = document.createElement('div');
          text = ejs.render(
            '<a href="/<%= user.username %>" class="text-reset"><div class="d-flex gap-2 gap-sm-3 py-2 px-3 search-item"><img src="<%= user.dp.url %>" alt="" class="rounded-circle profile-image-list" /><div class="d-flex justify-content-center flex-column align-self-center w-85 username-overflow"><span class="text-reset fw-semibold fs-7 username-overflow"><%= user.username %></span><% if (user.fullName){ %><div class="fs-7 my-n1 text-muted username-overflow"><%= user.fullName %></div><% } %></div></div></a>',
            { user: user }
          );
          div.innerHTML = text;
          document.getElementById('search-container').appendChild(div);
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
