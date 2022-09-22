const likeForms = document.querySelectorAll('.like-form');
const followForm = document.querySelector('.follow-form');
const followersLength = document.querySelector('#followers-length');
const links = document.querySelectorAll('a');

links.forEach((link) => {
  link.addEventListener('click', () => {
    console.log('hello');
    location.reload();
  });
});

likeForms.forEach((likeForm) => {
  likeForm.addEventListener('click', (e) => {
    e.preventDefault();
    axios
      .post(`${likeForm.action}`, {})
      .then(function (response) {
        const res = ejs.render(response.data);
        likeForm.parentElement.parentElement.querySelector(
          '.like-container'
        ).innerHTML = res;
        const btnLikeClass =
          likeForm.parentElement.parentElement.querySelector('.btn-like')
            .children[0].classList;
        btnLikeClass.toggle('red-heart');
        if (btnLikeClass.contains('fa-regular')) {
          btnLikeClass.remove('fa-regular');
          btnLikeClass.add('fa-solid');
        } else {
          btnLikeClass.add('fa-regular');
          btnLikeClass.remove('fa-solid');
        }
      })
      .catch(function (error) {
        window.location.href = '/login';
      });
  });
});

followForm.addEventListener('submit', (e) => {
  e.preventDefault();
  axios.post(`${followForm.action}`, {}).then(function (response) {
    followForm.innerHTML = response.data.button;
    followForm.action = response.data.action;
    followersLength.innerHTML = response.data.followers.length;
  });
});

// if (unFollowForm) {
//   unFollowForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     axios.post(`${unFollowForm.action}`, {}).then(function (response) {
//       console.log(response.data.html);
//       const html = ejs.render(response.data.html);
//       followDiv.innerHTML = html;
//     });
//   });
// }
