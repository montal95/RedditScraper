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
});

$("#article").on("click", ".save", function() {
  console.log($(this).attr("data-id"));
  let buttonId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/article/" + buttonId
  });
  this.innerHTML = "<i class='fas fa-check'></i>"
});

getArticles();
