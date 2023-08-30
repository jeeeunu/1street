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

        window.location.href = '/';
      } catch (error) {
        alert(error);
      }
    }
  }
};

//-- 프로필 이미지 미리보기 --//
const setThumbnail = (event) => {
  const reader = new FileReader();
  const inputElement = event.target;
  const previewWrap = inputElement.previousElementSibling;
  if (!previewWrap) {
    return;
  }

  previewWrap.innerHTML = '';

  for (const file of inputElement.files) {
    const img = document.createElement('img');
    img.classList.add('thumbnail');

    reader.onload = (e) => {
      img.src = e.target.result;
      previewWrap.appendChild(img);
    };

    reader.readAsDataURL(file);
  }
};

//-- 검색 --//
const siteSearchButton = document.querySelector('#siteSearchButton');
if (siteSearchButton) {
  siteSearchButton.addEventListener('click', () => {
    const siteSearchInput = document.querySelector('#siteSearchInput').value;
    console.log(siteSearchInput);
    window.location.href = `/search?content=${siteSearchInput}`;
  });
}
