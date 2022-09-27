const likeForms = document.querySelectorAll('.like-form');
const likeComments = document.querySelectorAll('.like-form-comment');
const followForm = document.querySelector('.follow-form');
const followersLength = document.querySelector('#followers-length');
const links = document.querySelectorAll('a');
const postShare = document.querySelectorAll('.post-share');

likeForms.forEach((likeForm) => {
  likeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btnLIke = likeForm.querySelector('.btn-like');
    const btnLikeClass = btnLIke.children[0].classList;

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

likeComments.forEach((likeComment) => {
  likeComment.addEventListener('submit', (e) => {
    e.preventDefault();
    let btnLikeClass = likeComment.children[0].children[0].classList;
    let likeContainer =
      likeComment.parentElement.parentElement.children[0].children[0]
        .children[1].children[1].children[1];
    let likeCount = parseInt(likeContainer.children[0].dataset.likeCount);
    btnLikeClass.toggle('red-heart');
    if (btnLikeClass.contains('fa-regular')) {
      btnLikeClass.remove('fa-regular');
      btnLikeClass.add('fa-solid');
      if (likeCount == 0) {
        likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="1">1 like</span>`;
      } else if (likeCount > 0) {
        likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="${
          likeCount + 1
        }">${likeCount + 1} likes</span>`;
      }
    } else {
      btnLikeClass.add('fa-regular');
      btnLikeClass.remove('fa-solid');
      if (likeCount == 1) {
        likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="0"></span>`;
      } else if (likeCount == 2) {
        likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="1">1 like</span>`;
      } else {
        likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="${
          likeCount - 1
        }">${likeCount - 1} likes</span>`;
      }
    }
    axios
      .post(`${likeComment.action}`, {})
      .then(function (response) {
        const resText = ejs.render(response.data.text);
        likeComment.children[0].innerHTML = response.data.heart;
        likeComment.parentElement.parentElement.children[0].children[0].children[1].children[1].children[1].innerHTML =
          resText;
      })
      .catch(function (error) {
        btnLikeClass = likeComment.children[0].children[0].classList;
        likeContainer =
          likeComment.parentElement.parentElement.children[0].children[0]
            .children[1].children[1].children[1];
        likeCount = parseInt(likeContainer.children[0].dataset.likeCount);
        btnLikeClass.toggle('red-heart');
        if (btnLikeClass.contains('fa-regular')) {
          btnLikeClass.remove('fa-regular');
          btnLikeClass.add('fa-solid');
          if (likeCount == 0) {
            likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="1">1 like</span>`;
          } else if (likeCount > 0) {
            likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="${
              likeCount + 1
            }">${likeCount + 1} likes</span>`;
          }
        } else {
          btnLikeClass.add('fa-regular');
          btnLikeClass.remove('fa-solid');
          if (likeCount == 1) {
            likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="0"></span>`;
          } else if (likeCount == 2) {
            likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="1">1 like</span>`;
          } else {
            likeContainer.innerHTML = `<span class="text-muted fs-8 fw-5" data-like-count="${
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

postShare.forEach((share) => {
  share.addEventListener('click', () => {
    console.log('hello');
    // navigator.share({ url: 'hello' });
  });
});
