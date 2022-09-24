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
    const btnLIke =
      likeForm.parentElement.parentElement.querySelector('.btn-like');
    const btnLikeClass =
      likeForm.parentElement.parentElement.querySelector('.btn-like')
        .children[0].classList;

    const likeContainer =
      likeForm.parentElement.parentElement.querySelector('.like-container');
    let likeContainerDiv = likeForm.parentElement.parentElement.querySelector(
      '.like-container div'
    );
    let likeCount = parseInt(
      likeForm.parentElement.parentElement.querySelector('.like-container span')
        .dataset.likeCount
    );

    btnLikeClass.toggle('red-heart');
    if (btnLikeClass.contains('fa-regular')) {
      btnLikeClass.remove('fa-regular');
      btnLikeClass.add('fa-solid');
      if (likeCount == 0) {
        likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="1">1 like</span>`;
      } else {
        likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="${
          likeCount + 1
        }">${likeCount + 1} likes</span>`;
      }
    } else {
      btnLikeClass.add('fa-regular');
      btnLikeClass.remove('fa-solid');
      if (likeCount == 1) {
        likeContainerDiv.innerHTML = `<span data-like-count="0">Be the first to <b>like this </b><span>`;
      } else if (likeCount == 2) {
        likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="1">1 like</span>`;
      } else {
        likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="${
          likeCount - 1
        }">${likeCount - 1} likes</span>`;
      }
    }

    axios
      .post(`${likeForm.action}`, {})
      .then(function (response) {
        const resText = ejs.render(response.data.text);
        likeContainer.innerHTML = resText;
        btnLIke.innerHTML = response.data.heart;
        const btnLikeClass =
          likeForm.parentElement.parentElement.querySelector('.btn-like')
            .children[0].classList;
      })
      .catch(function (error) {
        const btnLikeClass =
          likeForm.parentElement.parentElement.querySelector('.btn-like')
            .children[0].classList;
        likeContainerDiv = likeForm.parentElement.parentElement.querySelector(
          '.like-container div'
        );
        likeCount = parseInt(
          likeForm.parentElement.parentElement.querySelector(
            '.like-container span'
          ).dataset.likeCount
        );
        btnLikeClass.toggle('red-heart');
        if (btnLikeClass.contains('fa-regular')) {
          btnLikeClass.remove('fa-regular');
          btnLikeClass.add('fa-solid');
          if (likeCount == 0) {
            likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="1">1 like</span>`;
          } else {
            likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="${
              likeCount + 1
            }">${likeCount + 1} likes</span>`;
          }
        } else {
          btnLikeClass.add('fa-regular');
          btnLikeClass.remove('fa-solid');
          if (likeCount == 1) {
            likeContainerDiv.innerHTML = `<span data-like-count="0">Be the first to <b>like this </b><span>`;
          } else if (likeCount == 2) {
            likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="1">1 like</span>`;
          } else {
            likeContainerDiv.innerHTML = `<span class="fw-bolder" data-like-count="${
              likeCount - 1
            }">${likeCount - 1} likes</span>`;
          }
        }
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
