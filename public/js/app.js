console.log("Hello World");

function getArticles() {
  $("article").empty();
  $.getJSON("/article", function(data) {
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      let icon = "";
      let id = i + 1;
      if (data[i].saved) {
        icon = "<i class='fas fa-check'></i>";
      } else {
        icon = "<i class='fas fa-save'></i>";
      }
      $("#article").append(`
            <tr>
                <td data-id=${data[i]._id}>${id}</td>
                <td>${data[i].title}</td>
                <td>${data[i].subreddit}</td>
                <td><button type="button" class="btn btn-primary"> <a href='http://www.reddit.com${
                  data[i].link
                }' target="_blank"><i class="fas fa-book-open"></i></a></button></td>
                <td><button type="button" class="btn btn-primary save" data-id='${
                  data[i]._id
                }' data-saved='${data[i].saved}'>${icon}
                </button></td>
            </tr>
            `);
    }
  });
}

$.getJSON("/saved", function(articles) {
  console.log(articles);
});

$("#clearArticles").on("click", function() {
  $.ajax({
    type: "DELETE",
    dataType: "json",
    url: "/clear",
    success: function() {
      $("#article").empty();
    }
  });
  document.location.href = "/";
});

$("#article").on("click", ".save", function() {
  console.log($(this).attr("data-id"));
  let buttonId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/article/" + buttonId
  });
  this.innerHTML = "<i class='fas fa-check'></i>";
});

$(".noteForm").on("click", ".noteSubmit", function() {
  // console.log($(this).attr("data-id"));
  let articleId = $(this).attr("data-id");
  let title = $(`#title-${articleId}`)
    .val()
    .trim();
  let body = $(`#body-${articleId}`)
    .val()
    .trim();
  // console.log(`${articleId}, ${title}, ${body}`);
  $.ajax({
    method: "POST",
    url: "/article/" + articleId,
    data: {
      title: title,
      body: body
    }
  }).then(function(data) {
    // console.log(JSON.stringify(data) + "\n info for delete button")
    let noteId = data.note.length - 1;
    $(`#savedNotes-${articleId}`).append(`
    <tr id="${data.note[noteId]}">
      <td>${title}</td>
      <td>${body}</td>
      <td><button type="button" id="delete" data-id="${
        data.note[noteId]
      }" class="btn btn-danger float-right">X</button></td>
    </tr>`);
    $(`#title-${articleId}`).val("");
    $(`#body-${articleId}`).val("");
  });
});

$(".savedNoteArea").on("click", "#delete", function() {
  console.log(this);
  let noteId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    dataType: "json",
    url: "/clear/" + noteId
    }
  ).then(function(data){
    console.log(data);
    $(`#${noteId}`).remove();
  })
});

getArticles();
