const likeForms = document.querySelectorAll('.like-form');

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

// const updateLike = (likeForm) => {
//   axios
//     .get(`${likeForm.action}`)
//     .then(function (response) {
//       const res = ejs.render(response.data);
//       console.log(res);
//       likeForm.parentElement.parentElement.querySelector(
//         '.like-container'
//       ).innerHTML = res;
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };
