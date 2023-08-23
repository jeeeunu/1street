//-- TOP 버튼 --//
const scrollTop = function () {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '&uarr;';
  scrollBtn.setAttribute('id', 'scroll-btn');
  document.body.appendChild(scrollBtn);
  const scrollBtnDisplay = function () {
    window.scrollY > window.innerHeight
      ? scrollBtn.classList.add('show')
      : scrollBtn.classList.remove('show');
  };
  window.addEventListener('scroll', scrollBtnDisplay);
  const scrollWindow = function () {
    if (window.scrollY != 0) {
      setTimeout(function () {
        window.scrollTo(0, window.scrollY - 50);
        scrollWindow();
      }, 10);
    }
  };
  scrollBtn.addEventListener('click', scrollWindow);
};
scrollTop();

//-- 로그아웃 api --//
const logout = async () => {
  if (confirm) {
    const confirmLogout = confirm('로그아웃하시겠습니까?');

    if (confirmLogout) {
      try {
        const response = await fetch('auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
        } else {
          console.error('로그아웃 중 오류가 발생했습니다.');
        }

        location.reload();
      } catch (error) {
        alert(error);
      }
    }
  }
};

//-- 프로필 이미지 미리보기 --//
const setThumbnail = (event) => {
  const reader = new FileReader();
  const previewWrap = document.querySelector('.edit-img-wrap');

  reader.onload = (event) => {
    previewWrap.innerHTML = '';
    const img = document.createElement('img');
    img.src = event.target.result;
    previewWrap.appendChild(img);
  };

  reader.readAsDataURL(event.target.files[0]);
};
