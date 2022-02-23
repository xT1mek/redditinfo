function toggleForm() {
  document.getElementById("my-dropdown").classList.toggle("show");
}

function inputRange() {
  let rangePost = document.getElementById('rng-post');
  let numPost = document.getElementById('num-post');
  numPost.value = rangePost.value;
}

function getFormValue(event) {
  event.preventDefault();     
}

function clearPosts() {
  document.getElementById("list-post").innerHTML = "";
}

const postsContainer = document.querySelector(".app__posts-list");
const postTypeDropdown = document.querySelector(".app__post-type");
    
function postTypeChoose (){
  let index = postTypeDropdown.selectedIndex;
  let value = postTypeDropdown.options[index].value;

  renderPosts(value);
}

const renderPosts = (postType) => {
  fetch(`https://www.reddit.com/${postType}.json`)
    .then(res => res.json())
    .then(function(res) {
      let currPost, markup = '';
      const postsArr = res.data.children;
      let numPost = document.getElementById('num-post');
      
      clearPosts();

      for (let postIndex = 0; postIndex < numPost.value; postIndex++) {
        currPost = postsArr[postIndex].data;
        markup += `
          <a class="post" target="_blank" href="https://www.reddit.com/${currPost.permalink}">
            <div class="post__title"> ${currPost.title} </div>
            ${currPost.selftext} 
            <div class="post__image">
              <img src="${currPost.url}" alt="no image" width="500px" heigth="500px" onerror="this.style.visibility = 'hidden'">
            </div>
            </div>
            <div class="post__author"> Posted by ${currPost.author} </div>
          </a>`;
      }
      postsContainer.insertAdjacentHTML('afterbegin', markup);
    })
    .catch(function(err) {
      console.log(err); 
    });
};

renderPosts('hot')