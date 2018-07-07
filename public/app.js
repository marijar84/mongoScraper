// Grab the articles as a json

function getArticles() {
  $.ajax({
    method: "GET",
    url: "/articles"
  })
    .then(function (data) {

      drawArticles(data, true);

    });
}

function drawArticles(data, saveArticles) {

  $("#articles").empty();

  for (var item = 0; item < data.length; item++) {

    var panelDefault = $('<div class="panel panel-info">');

    var panelHeading = $('<div class="panel-heading">');

    panelHeading.html(data[item].title);

    panelDefault.append(panelHeading);

    var panelBody = $('<div class="panel-body">');

    panelBody.html(data[item].summary);

    if (saveArticles == true) {
      var btnAddNote = $('<br/><br/><button id="btnNote" type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Add Note</button>  ');
      btnAddNote.attr("value-id", data[item]._id);

      var btnDelete = $('<button id="btnDelete" type="button" class="btn btn-primary" style="visibility: visible">Delete</button>');
      btnDelete.attr("value-id", data[item]._id);

      $("#myModal").attr("value-id", data[item]._id);

      panelBody.append(btnAddNote);
      panelBody.append(btnDelete);
    }
    else {
      var btnSaveArticle = $('<br/><br/><button id="btnSave" type="button" class="btn btn-primary" style="visibility: visible">Save</button>');
      btnSaveArticle.attr("value-id", data[item]._id);
      btnSaveArticle.attr("value-title", data[item].title);
      btnSaveArticle.attr("value-link", data[item].link);
      btnSaveArticle.attr("value-summary", data[item].summary);

      panelBody.append(btnSaveArticle);
    }

    panelDefault.append(panelBody);

    $("#articles").append(panelDefault);
  }
}

$(document).on("click", "#btnSave", function (event) {

  var vTitle = $(this).attr("value-title");
  var vLink = $(this).attr("value-link");
  var vSummary = $(this).attr("value-summary");

  $.ajax({
    method: "POST",
    url: "/articles",
    data: {
      title: vTitle,
      link: vLink,
      summary: vSummary
    }
  })
    // With that done, add the note information to the page
    .then(function (data) {
      $(this).css('visibility', 'hidden');
      //drawArticles(data, false);

    });
});


$(document).on("click", "#scraper", function () {

  console.log("Clik");

  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function (data) {

      drawArticles(data, false);

    });
});

$(document).on("click", "#savedArticles", function () {

  getArticles();
});

var idArticle = '';

$('#myModal').on('show.bs.modal', function (e) {
  //e.preventDefault() // stops modal from being shown
  idArticle = $(this).attr("value-id");

  getArticleByNote(idArticle);

});

function getArticleByNote(idArticle) {
  $.ajax({
    method: "GET",
    url: "/articles/" + idArticle
  })
    // With that done, add the note information to the page
    .then(function (data) {
      //console.log(data.note.length);
      console.log(data.note.length);

      //for (var item = 0; item < data.note.length; item++) {

      var panelDefault = $('<div class="panel panel-success">');

      var panelHeading = $('<div class="panel-heading">');

      panelHeading.html(data.note.title);

      panelDefault.append(panelHeading);

      var panelBody = $('<div class="panel-body">');

      panelBody.html(data.note.body);

      var btnDeleteNote = $('<br/><button id="btnDeleteNote" type="button" class="btn btn-primary">Delete</button>');
      btnDeleteNote.attr("value-id", data.note._id);

      panelBody.append(btnDeleteNote);

      panelDefault.append(panelBody);

      $("#notes").append(panelDefault);
      //}

    });
}

$(document).on("click", "#btnDelete", function () {

  console.log("Clik delete article");

  var idArticle = $(this).attr("value-id");

  console.log(idArticle);

  $.ajax({
    method: "DELETE",
    url: "/articles/" + idArticle,
    data: {
      // Value taken from title input
      _id: idArticle
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      getArticles();
    });
});

$(document).on("click", "#btnDeleteNote", function () {

  console.log("Clik");

  var idNote = $(this).attr("value-id");

  console.log(idNote);

  $.ajax({
    method: "DELETE",
    url: "/articlesbynote/" + idNote,
    data: {
      // Value taken from title input
      _id: idNote
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
    });
});

$(document).on("click", "#saveNote", function (event) {

  console.log("Clik");

  $.ajax({
    method: "POST",
    url: "/articles/" + idArticle,
    data: {
      // Value taken from title input
      title: $("#titleNote").val(),
      // Value taken from note textarea
      body: $("#bodyNote").val()
    }
  })
    // With that done
    .then(function (data) {

      $("#titleNote").val().empty();
      $("#bodyNote").val().empty();
    });
});