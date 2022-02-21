function myDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function inputRange() {
  let rangepost = document.getElementById('rngpost');
  let numpost = document.getElementById('numpost');
  numpost.value = rangepost.value;
}

function inputRng() {
  let rangecomms = document.getElementById('rngcomms');
  let numcomms = document.getElementById('numcomms');
  numcomms.value = rangecomms.value;
}

function getFormValue(event) {
  event.preventDefault();     
}

function clearPosts() {
  document.getElementById("listpost").innerHTML = "";
}

const blok = document.querySelector(".app__posts-list");
const posttype = document.querySelector(".post-type");

const renderPosts = () => {
  fetch(`https://www.reddit.com/top.json`)
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      let currPost, markup = ``;
      const postsArr = res.data.children;

      clearPosts();

      for (let i = 0; i < numpost.value; i++) {
        currPost = postsArr[i].data;
        markup += `
          <a class="app__posts-list-post" target="_blank" href="https://www.reddit.com/${currPost.permalink}">
            <div class="app__posts-list-post-title"> ${currPost.title} </div>
              ${currPost.selftext} 
              </br></br>
              <div class="app__posts-list-post-image">
                <img src="${currPost.url}" alt="no image" width="500px" heigth="500px" onerror="this.style.visibility = 'hidden'">
              </div>
            </div>
            <div class="app__posts-list-post-author"> Posted by ${currPost.author} </div>
          </a>`;
      }
      
      blok.insertAdjacentHTML('afterbegin', markup);
    })
    .catch(function(err) {
      console.log(err); 
    });
    
};
 renderPosts('top')