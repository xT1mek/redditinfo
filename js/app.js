document.getElementById('myDate').valueAsDate = new Date();

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

function addMorePosts(){
  let forma = document.getElementById('myDropdown');
  forma.addEventListener('submit', getFormValue);
  
  const data = document.querySelector('[name = "data"]'),
        posts = document.querySelector('[name = "numberposts"]'),
        comms = document.querySelector('[name = "numbercomms"]');

  return {
    data: data.value,
    posts: posts.value,
    comms: comms.value
  }
}

function addPosts(){
  clearPosts();
  const a = addMorePosts();
  for (let i = 0; i < a.posts; i++){
    let listel = document.createElement('li');
    listel.className = "app__posts-list-el";
    listpost.append(listel);
  }   
  console.log(addMorePosts());
}

