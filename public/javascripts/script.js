const likeForms = document.querySelectorAll('.like-form');
const likeComments = document.querySelectorAll('.like-form-comment');
const followForms = document.querySelectorAll('.follow-form');
const followersLength = document.querySelector('#followers-length');
const links = document.querySelectorAll('a');
const postLinks = document.querySelectorAll('.post-link');
let doubleTaps = document.querySelectorAll('.double-tap-post');
const usernameOverflow = document.querySelector('.username-overflow');
const readMores = document.querySelectorAll('.read-more');

doubleTaps.forEach((doubleTap) => {
  doubleTap.addEventListener('dblclick', () => {
    let btnLikeClass =
      doubleTap.parentElement.querySelector('.like-form').children[0]
        .children[0].classList;
    if (btnLikeClass.contains('fa-regular')) {
      doubleTap.parentElement.querySelector('.like-form').click();
      btnLikeClass =
        doubleTap.parentElement.querySelector('.like-form').children[0]
          .children[0].classList;
    }
    doubleTap.children[1].classList.add('like');
    setTimeout(() => {
      doubleTap.children[1].classList.remove('like');
    }, 1200);
  });
});

likeForms.forEach((likeForm) => {
  likeForm.addEventListener('click', (e) => {
    e.preventDefault();
    const btnLike = likeForm.querySelector('.btn-like');
    const btnLikeClass = btnLike.children[0].classList;

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
        likeContainerDiv.innerHTML = `<span data-like-count="0">Be the first to <b class="like-this">like this </b><span>`;
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
        btnLike.innerHTML = response.data.heart;
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
            likeContainerDiv.innerHTML = `<span data-like-count="0">Be the first to <b class="like-this">like this </b><span>`;
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
        .children[1].children[1].children[1].children[0];
    console.log(likeContainer);
    let likeCount = parseInt(likeContainer.children[0].dataset.likeCount);
    console.log(likeCount);
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
        likeComment.parentElement.parentElement.children[0].children[0].children[1].children[1].children[1].children[0].innerHTML =
          resText;
      })
      .catch(function (error) {
        btnLikeClass = likeComment.children[0].children[0].classList;
        likeContainer =
          likeComment.parentElement.parentElement.children[0].children[0]
            .children[1].children[1].children[1].children[0];
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

if (followForms) {
  followForms.forEach((followForm) => {
    followForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (followForm.children[0].classList.contains('btn-follow')) {
        followForm.children[0].innerHTML = `<div class="spinner-border spinner-border-sm text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>`;
      } else {
        followForm.children[0].innerHTML = `<div class="spinner-border spinner-border-sm text-secondary" role="status">
      <span class="sr-only">Loading...</span>
    </div>`;
      }
      followForm.parentElement.children[0].disable = true;
      axios.post(`${followForm.action}`, {}).then(function (response) {
        followForm.innerHTML = response.data.button;
        followForm.action = response.data.action;
        followersLength.innerHTML = response.data.followers.length;
      });
    });
  });
}

//For sharing post
postLinks.forEach((post) => {
  post.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        url: post.dataset.url,
      });
    } else {
      console.log('hello');
    }
  });
});

//Auto grow textarea

function autoGrow(oField) {
  if (oField.scrollHeight > oField.clientHeight) {
    oField.style.height = `${oField.scrollHeight}px`;
  }
}

// Read more functionality

readMores.forEach((readMore) => {
  readMore.addEventListener('click', () => {
    readMore.parentElement.querySelector('.more').style.display = 'inline';
    readMore.parentElement.querySelector('.dots').style.display = 'none';
    readMore.parentElement.querySelector('.read-more').style.display = 'none';
  });
});

// Show hide password
const show = document.getElementById('show');
const hide = document.getElementById('hide');
const password = document.getElementById('password');

if (show || hide) {
  show.addEventListener('click', () => {
    hide.style.display = 'block';
    show.style.display = 'none';
    password.type = 'text';
  });

  hide.addEventListener('click', () => {
    show.style.display = 'block';
    hide.style.display = 'none';
    password.type = 'password';
  });
}

const npop = document.getElementById('npop-container');

const options = {
  html: true,
  //html element
  //content: $("#popover-content")
  trigger: 'manual',
  placement: 'bottom',
  offset: [0, 15],
  //Doing below won't work. Shows title only
  //content: $("#popover-content").html()
};

window.addEventListener('load', () => {
  if (npop) {
    const popover = new bootstrap.Popover(npop, options);
    setTimeout(() => {
      popover.show();
    }, 500);
    setTimeout(() => {
      popover.hide();
    }, 7000);
  }
});
